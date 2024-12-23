from flask import Flask
from flask_cors import CORS
from routes import auth, documents, legal_ai, immigration

app = Flask(__name__)
CORS(app)

# Register routes
app.register_blueprint(auth.bp)
app.register_blueprint(documents.bp)
app.register_blueprint(legal_ai.bp)
app.register_blueprint(immigration.bp)

if __name__ == '__main__':
    app.run(debug=True)


