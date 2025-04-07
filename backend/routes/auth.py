from flask import Blueprint, request, jsonify, session, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json
from datetime import datetime, timedelta
import uuid
# Import PyJWT for token handling
import jwt
from functools import wraps
from models.user import User
from models.database import db
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# Create the auth blueprint with a URL prefix
bp = Blueprint('auth', __name__, url_prefix='/api/auth', cli_group=None)

# Create users directory if it doesn't exist
if not os.path.exists('data/users'):
    os.makedirs('data/users')

# Secret key for JWT
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'dev_secret_key')

# User database file
USERS_FILE = 'data/users/users.json'

# Initialize users file if it doesn't exist
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, 'w') as f:
        json.dump([], f)

def get_users():
    try:
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def generate_safe_password_hash(password):
    """Generate a password hash using pbkdf2:sha256 method"""
    return generate_password_hash(password, method='pbkdf2:sha256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'error': 'Token is missing'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
            
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'error': 'Invalid token'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

def send_verification_email(user_email, token):
    """Send verification email to user"""
    try:
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', '587'))
        smtp_username = os.getenv('SMTP_USERNAME')
        smtp_password = os.getenv('SMTP_PASSWORD')
        
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = user_email
        msg['Subject'] = 'Verify your SmartProBono account'
        
        verification_url = f"{os.getenv('FRONTEND_URL')}/verify-email?token={token}"
        body = f"""
        Welcome to SmartProBono!
        
        Please click the link below to verify your email address:
        {verification_url}
        
        This link will expire in 24 hours.
        
        If you did not create an account, please ignore this email.
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        current_app.logger.error(f"Error sending verification email: {str(e)}")
        return False

@bp.route('/signup', methods=['POST'])
def signup():
    """Register a new user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        required_fields = ['email', 'password', 'role']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
        
        if User.get_by_email(data['email']):
            return jsonify({'error': 'Email already registered'}), 400
            
        if data['role'] not in ['client', 'attorney']:
            return jsonify({'error': 'Invalid role'}), 400
        
        try:
            # Generate verification token
            verification_token = secrets.token_urlsafe(32)
            
            # Create new user
            user = User(
                email=data['email'],
                password=data['password'],
                role=data['role'],
                verification_token=verification_token,
                **{k: v for k, v in data.items() if k not in ['email', 'password', 'role']}
            )
            
            db.session.add(user)
            db.session.commit()
            
            # Send verification email
            if not send_verification_email(user.email, verification_token):
                return jsonify({
                    'warning': 'User created but verification email could not be sent',
                    'user': user.to_dict()
                }), 201
            
            return jsonify({
                'message': 'User created successfully. Please check your email for verification.',
                'user': user.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error creating user: {str(e)}")
            return jsonify({'error': f'Database error: {str(e)}'}), 500
            
    except Exception as e:
        current_app.logger.error(f"Error in signup route: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    if 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password are required'}), 400
    
    user = User.get_by_email(data['email'])
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    if not user.is_verified:
        return jsonify({'error': 'Please verify your email before logging in'}), 401
    
    # Update last login
    user.update_last_login()
    
    # Generate token
    token = jwt.encode(
        {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=1)
        },
        current_app.config['SECRET_KEY'],
        algorithm="HS256"
    )
    
    return jsonify({
        'token': token,
        'user': user.to_dict()
    })

@bp.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    """Verify user's email"""
    user = User.get_by_verification_token(token)
    
    if not user:
        return jsonify({'error': 'Invalid verification token'}), 400
    
    if user.is_verified:
        return jsonify({'message': 'Email already verified'}), 200
    
    user.is_verified = True
    user.verification_token = None
    db.session.commit()
    
    return jsonify({'message': 'Email verified successfully'})

@bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Get current user's profile"""
    return jsonify(current_user.to_dict())

@bp.route('/me', methods=['PUT'])
@token_required
def update_profile(current_user):
    """Update user's profile"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Don't allow updating email or role through this endpoint
    forbidden_fields = ['email', 'role', 'password_hash', 'is_verified', 'verification_token']
    for field in forbidden_fields:
        data.pop(field, None)
    
    try:
        for key, value in data.items():
            setattr(current_user, key, value)
        
        db.session.commit()
        return jsonify({
            'message': 'Profile updated successfully',
            'user': current_user.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating profile: {str(e)}")
        return jsonify({'error': 'Could not update profile'}), 500

@bp.route('/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    """Change user's password"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    if 'current_password' not in data or 'new_password' not in data:
        return jsonify({'error': 'Current and new passwords are required'}), 400
    
    if not current_user.check_password(data['current_password']):
        return jsonify({'error': 'Current password is incorrect'}), 401
    
    try:
        current_user.set_password(data['new_password'])
        db.session.commit()
        return jsonify({'message': 'Password changed successfully'})
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error changing password: {str(e)}")
        return jsonify({'error': 'Could not change password'}), 500