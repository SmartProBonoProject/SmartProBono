from flask import Flask
from flask_cors import CORS
from routes.legal_ai import legal_ai
from routes.contracts import contracts
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(legal_ai)
app.register_blueprint(contracts)

@app.route('/')
def home():
    return 'SmartProBono API is running!'

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, port=port)


