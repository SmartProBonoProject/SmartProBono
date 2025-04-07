from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, disconnect, join_room, leave_room, rooms
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import os
import logging
import json
import time
import uuid
from datetime import datetime
import random

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize app-level variables that will be populated in create_app()
socketio = None
notification_service = None
online_users = {}  # sid -> { user_id, rooms }
typing_users = {}  # room_id -> {user_id: timestamp}
message_rate_limit = {}  # user_id -> list of timestamps
RATE_LIMIT_MAX_MESSAGES = 20  # max messages per minute
RATE_LIMIT_WINDOW = 60  # seconds

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Load configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_key_123')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt_dev_key_123')
    
    # Initialize extensions
    from models.database import db, init_db
    db.init_app(app)
    jwt = JWTManager(app)
    
    global socketio
    socketio = SocketIO(app, cors_allowed_origins="*")
    
    # Import routes and services
    from routes.notification_routes import notification_routes
    from services.notification_service import init_notification_service, get_notification_service
    
    # Initialize notification service
    init_notification_service(socketio)
    global notification_service
    notification_service = get_notification_service()
    
    # Register blueprints
    app.register_blueprint(notification_routes)
    
    # Import utils after initialization
    from utils.notification_utils import (
        create_message_notification,
        create_legal_response_notification,
        create_case_status_notification,
        create_document_notification
    )
    
    # Register CLI commands
    from cli import db as db_cli
    app.cli.add_command(db_cli)
    
    # Initialize database
    with app.app_context():
        try:
            db.create_all()
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Error creating database tables: {e}")
    
    # Register Socket.IO event handlers
    @socketio.on('connect')
    def handle_connect():
        """Handle client connection"""
        try:
            sid = None
            # Try different methods to get sid
            try:
                if hasattr(request, 'sid'):  # type: ignore
                    sid = request.sid  # type: ignore
                elif hasattr(request, 'environ') and request.environ.get('socketio'):
                    sid = request.environ.get('socketio').sid  # type: ignore
            except:
                # If all methods fail, generate a temporary ID
                sid = str(uuid.uuid4())
                
            logger.info(f"Client connected: {sid or 'unknown'}")
            emit('connection_success', {'message': 'Connected successfully', 'temp_sid': sid})
        except Exception as e:
            logger.error(f"Error handling connection: {e}")
            # Still send a success message even if we couldn't get the SID
            emit('connection_success', {'message': 'Connected with errors'})
    
    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle client disconnection"""
        try:
            sid = None
            # Try different methods to get sid
            try:
                if hasattr(request, 'sid'):  # type: ignore
                    sid = request.sid  # type: ignore
                elif hasattr(request, 'environ') and request.environ.get('socketio'):
                    sid = request.environ.get('socketio').sid  # type: ignore
            except:
                pass
                
            if sid and sid in online_users:
                user_data = online_users[sid]
                logger.info(f"Client disconnected: {sid} (User: {user_data.get('user_id')})")
                del online_users[sid]
            else:
                logger.info(f"Client disconnected: {sid or 'unknown'}")
        except Exception as e:
            logger.error(f"Error handling disconnection: {e}")
    
    @socketio.on('authenticate')
    def handle_authentication(data):
        """Handle client authentication"""
        try:
            sid = None
            # Try different methods to get sid
            try:
                if hasattr(request, 'sid'):  # type: ignore
                    sid = request.sid  # type: ignore
                elif hasattr(request, 'environ') and request.environ.get('socketio'):
                    sid = request.environ.get('socketio').sid  # type: ignore
            except:
                # Use user_id as temporary sid if we can't get the real one
                pass
                
            user_id = data.get('user_id')
            
            if not user_id:
                emit('auth_error', {'message': 'User ID is required'})
                return
                
            # If we couldn't get a sid, use a temporary one based on user_id
            if not sid:
                sid = f"temp_{user_id}_{str(uuid.uuid4())}"
                logger.warning(f"Using temporary SID for user {user_id}: {sid}")
            
            # Store user data
            online_users[sid] = {
                'user_id': user_id,
                'authenticated': True,
                'rooms': []
            }
            
            # Join user's room
            join_room(f"user_{user_id}")
            
            logger.info(f"User authenticated: {user_id} (SID: {sid})")
            emit('auth_success', {'message': 'Authenticated successfully'})
            
        except Exception as e:
            logger.error(f"Error handling authentication: {e}")
            emit('auth_error', {'message': f'Error handling authentication: {str(e)}'})
    
    @socketio.on('deauthenticate')
    def handle_deauthentication():
        """Handle client deauthentication"""
        try:
            sid = None
            # Try different methods to get sid
            try:
                if hasattr(request, 'sid'):  # type: ignore
                    sid = request.sid  # type: ignore
                elif hasattr(request, 'environ') and request.environ.get('socketio'):
                    sid = request.environ.get('socketio').sid  # type: ignore
            except:
                pass
                
            if sid and sid in online_users:
                user_data = online_users[sid]
                user_id = user_data.get('user_id')
                
                # Leave user's room
                leave_room(f"user_{user_id}")
                
                # Remove user data
                del online_users[sid]
                
                logger.info(f"User deauthenticated: {user_id} (SID: {sid})")
                emit('deauth_success', {'message': 'Deauthenticated successfully'})
            else:
                emit('deauth_error', {'message': 'Not authenticated or session not found'})
        except Exception as e:
            logger.error(f"Error handling deauthentication: {e}")
            emit('deauth_error', {'message': f'Error handling deauthentication: {str(e)}'})
    
    @socketio.on('test_notification')
    def handle_test_notification(data):
        """Handle test notification request"""
        try:
            sid = None
            # Try different methods to get sid
            try:
                if hasattr(request, 'sid'):  # type: ignore
                    sid = request.sid  # type: ignore
                elif hasattr(request, 'environ') and request.environ.get('socketio'):
                    sid = request.environ.get('socketio').sid  # type: ignore
            except:
                pass
                
            if not sid or sid not in online_users:
                emit('error', {'message': 'Not authenticated or session not found'})
                return
                
            user_id = online_users[sid].get('user_id')
            
            # Get notification data
            notification_type = data.get('type', 'info')
            title = data.get('title', 'Test Notification')
            message = data.get('message', 'This is a test notification')
            
            # Create notification object
            notification = {
                'id': str(uuid.uuid4()),
                'user_id': user_id,
                'type': notification_type,
                'title': title,
                'message': message,
                'created_at': datetime.utcnow().isoformat(),
                'is_read': False
            }
            
            logger.info(f"Test notification sent to user {user_id}")
            emit('notification_sent', {'notification': notification})
            # Also emit to the user's room to simulate receiving a notification
            emit('notification', notification, room=f"user_{user_id}")  # type: ignore
                
        except Exception as e:
            logger.error(f"Error handling test notification: {e}")
            emit('error', {'message': f'Error handling test notification: {str(e)}'})
            
    # Add other Socket.IO event handlers and helper functions
    import socket_events
    socket_events.register_socket_events(socketio, app)
    
    # Add health check endpoint
    @app.route('/api/health')
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'operational',
            'version': '1.0.0',
            'environment': os.environ.get('FLASK_ENV', 'development'),
            'memory_usage': {
                'active_connections': len(online_users)
            }
        })
        
    # Add database status endpoint
    @app.route('/api/db-status')
    def db_status():
        """Database status check endpoint"""
        try:
            # Import models we need to check
            from models.user import User
            from models.notification import Notification
            
            # Check database connection by counting records
            with app.app_context():
                user_count = User.query.count()
                notification_count = Notification.query.count()
                
            return jsonify({
                'status': 'connected',
                'database': app.config['SQLALCHEMY_DATABASE_URI'],
                'user_count': user_count,
                'notification_count': notification_count
            })
        except Exception as e:
            logger.error(f"Database error: {e}")
            return jsonify({
                'status': 'error',
                'message': str(e)
            }), 500
            
    # Add route to show active connections
    @app.route('/api/connections')
    def get_connections():
        """Get active WebSocket connections"""
        return jsonify({
            'active_connections': len(online_users),
            'users_online': [
                {'user_id': data.get('user_id'), 'connected_at': data.get('connected_at', 'unknown')}
                for sid, data in online_users.items()
            ]
        })
        
    # Add route to send test notifications
    @app.route('/api/test-notification', methods=['POST'])
    def send_test_notification():
        """Send a test notification to a connected user"""
        try:
            # Import the emit function from flask_socketio
            from flask_socketio import emit
            
            data = request.get_json()
            if not data:
                return jsonify({'error': 'No data provided'}), 400
                
            # Check if required fields are present
            required_fields = ['type', 'title', 'message']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
                
            # Get notification data
            notification_type = data.get('type', 'info')
            title = data.get('title', 'Test Notification')
            message = data.get('message', 'This is a test notification')
            user_id = data.get('user_id')
            
            # Create notification object
            notification = {
                'id': str(uuid.uuid4()),
                'type': notification_type,
                'title': title,
                'message': message,
                'created_at': datetime.utcnow().isoformat(),
                'is_read': False
            }
            
            # If user_id is provided, send to specific user
            if user_id:
                # Find the socket for this user
                user_room = f"user_{user_id}"
                logger.info(f"Sending test notification to user {user_id}")
                # Use socketio instance or use Flask-SocketIO's emit function
                emit('notification', notification, room=user_room, namespace='/')  # type: ignore
                return jsonify({'success': True, 'message': f'Notification sent to user {user_id}'})
            
            # Otherwise, broadcast to all connected users
            users_notified = []
            for sid, user_data in online_users.items():
                current_user_id = user_data.get('user_id')
                if current_user_id:
                    user_room = f"user_{current_user_id}"
                    notification['user_id'] = current_user_id
                    emit('notification', notification, room=user_room, namespace='/')  # type: ignore
                    users_notified.append(current_user_id)
            
            logger.info(f"Broadcast test notification to {len(users_notified)} users")
            return jsonify({
                'success': True, 
                'message': f'Notification broadcast to {len(users_notified)} users',
                'users_notified': users_notified
            })
                
        except Exception as e:
            logger.error(f"Error sending test notification: {e}")
            return jsonify({'error': f'Error sending test notification: {str(e)}'}), 500
    
    return app

def main():
    """Run the Flask application"""
    try:
        # Create the Flask app
        app = create_app()
        
        # Get the port
        port = int(os.environ.get('PORT', 5002))
        
        # Log the start
        logger.info(f"Starting server on port {port}")
        
        # Run the app with SocketIO if available
        global socketio
        if socketio is not None:
            socketio.run(app, host='0.0.0.0', port=port, debug=True)  # type: ignore
        else:
            logger.warning("SocketIO not available, using standard Flask server")
            app.run(host='0.0.0.0', port=port, debug=True)
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        # Try running without SocketIO as fallback
        try:
            logger.info("Attempting to start server without SocketIO...")
            app = create_app()
            app.run(host='0.0.0.0', port=port, debug=True)
        except Exception as e:
            logger.error(f"Failed to start server without SocketIO: {e}")
            raise

if __name__ == '__main__':
    main()


