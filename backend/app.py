from flask import Flask
from flask_cors import CORS
from routes.legal_ai import bp as legal_ai
from routes.contracts import contracts
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS for both development and production
default_origins = ['http://localhost:3000', 'https://smartprobono.netlify.app']
allowed_origins = os.environ.get('ALLOWED_ORIGINS', ','.join(default_origins)).split(',')
CORS(app, resources={r"/*": {"origins": allowed_origins, "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type"]}})

# Register blueprints
app.register_blueprint(legal_ai)
app.register_blueprint(contracts)

@app.route('/')
def home():
    return 'SmartProBono API is running!'

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)


