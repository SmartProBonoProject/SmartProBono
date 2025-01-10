from flask import Blueprint, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

bp = Blueprint('legal_ai', __name__, url_prefix='/api/legal')
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@bp.route('/rights', methods=['POST'])
def get_rights_info():
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