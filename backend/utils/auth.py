from functools import wraps
from flask import request, jsonify, abort, g, current_app
import jwt
from datetime import datetime, timedelta
import os

# Define user roles and their hierarchy
ROLES = {
    'client': 0,
    'lawyer': 10,
    'admin': 20,
    'superadmin': 30
}

# Define permissions for each endpoint
PERMISSIONS = {
    'view_queue': ['client', 'lawyer', 'admin', 'superadmin'],
    'manage_queue': ['lawyer', 'admin', 'superadmin'],
    'admin_actions': ['admin', 'superadmin'],
    'system_config': ['superadmin']
}

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            # Verify token using the app config secret key
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            # Add user to Flask's g object
            g.user = data
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
            
        return f(*args, **kwargs)
    
    return decorated

def require_role(role):
    """Require a specific role or higher"""
    def decorator(f):
        @wraps(f)
        @require_auth
        def decorated_function(*args, **kwargs):
            user_role = g.user.get('role', 'client')
            if ROLES.get(user_role, 0) < ROLES.get(role, 0):
                return jsonify({'message': 'Insufficient permissions'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def check_permission(permission):
    """Check if user has the required permission"""
    user_role = g.user.get('role', 'client')
    allowed_roles = PERMISSIONS.get(permission, [])
    return user_role in allowed_roles

def create_token(user_data):
    """Create a new JWT token"""
    token = jwt.encode({
        'user_id': user_data.get('id'),
        'email': user_data.get('email'),
        'role': user_data.get('role', 'client'),
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")
    
    return token 