from flask import Blueprint, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

bp = Blueprint('legal_ai', __name__, url_prefix='/api/legal')
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@bp.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        data = request.json
        message = data.get('message')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # Enhanced system prompt for legal context
        system_prompt = """You are an AI legal assistant providing general legal information and guidance. Your role is to:

1. Provide clear, accurate information about legal concepts, rights, and procedures
2. Use plain language to explain complex legal terms and concepts
3. Reference relevant legal frameworks when applicable
4. Always include appropriate disclaimers about the limitations of AI legal advice
5. Suggest when and how to seek professional legal counsel
6. Focus on educational and informational aspects rather than specific legal advice
7. Provide relevant resources and next steps when appropriate

Remember: While you can explain legal concepts and provide general guidance, always emphasize that you're not a substitute for a qualified legal professional and cannot provide specific legal advice."""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "assistant", "content": "I'll help you understand legal concepts and provide general guidance. What would you like to know?"},
                {"role": "user", "content": message}
            ],
            temperature=0.7,
            max_tokens=800,
            presence_penalty=0.6,  # Encourage diverse responses
            frequency_penalty=0.3   # Reduce repetition
        )

        ai_response = response.choices[0].message.content
        
        # Add a disclaimer if not already present in the response
        disclaimer = "\n\nPlease note: This information is for general guidance only. For specific legal advice, consult with a qualified legal professional."
        if "consult" not in ai_response.lower() and "attorney" not in ai_response.lower():
            ai_response += disclaimer

        return jsonify({'response': ai_response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/rights', methods=['POST', 'OPTIONS'])
def get_rights_info():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        data = request.json
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful legal assistant providing information about legal rights. Always remind users to consult with a qualified legal professional for specific legal advice."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )

        ai_response = response.choices[0].message.content
        return jsonify({'response': ai_response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/procedures', methods=['POST'])
def get_procedures_info():
    try:
        data = request.json
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful legal assistant providing information about legal procedures. Always remind users to consult with a qualified legal professional for specific legal advice."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )

        ai_response = response.choices[0].message.content
        return jsonify({'response': ai_response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/analyze-document', methods=['POST'])
def analyze_document():
    try:
        data = request.json
        document_text = data.get('text')
        
        if not document_text:
            return jsonify({'error': 'No document text provided'}), 400

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a legal document analyzer. Provide clear explanations of legal documents in simple terms."},
                {"role": "user", "content": f"Please analyze this legal document and explain it in simple terms: {document_text}"}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        analysis = response.choices[0].message.content
        return jsonify({'analysis': analysis})

    except Exception as e:
        return jsonify({'error': str(e)}), 500 