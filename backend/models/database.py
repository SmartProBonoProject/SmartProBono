from flask_sqlalchemy import SQLAlchemy

# Create the SQLAlchemy instance
db = SQLAlchemy()

def init_db(app):
    """Initialize the database with the Flask app."""
    db.init_app(app)
    
    # Create all tables
    with app.app_context():
        # Import models here to ensure they are registered with SQLAlchemy
        from models.user import User  # This imports the User model
        
        # Create tables
        db.create_all()
        
        print("Database initialized successfully") 