from flask import Blueprint, request, jsonify, current_app, send_file
import os
import requests
from datetime import datetime
import json
from models.database import db
import random

bp = Blueprint('legal_ai', __name__, url_prefix='/api/legal')

# Constants
CHAT_HISTORY_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'chat_history')
os.makedirs(CHAT_HISTORY_DIR, exist_ok=True)
os.makedirs(os.path.join(CHAT_HISTORY_DIR, 'files'), exist_ok=True)

# Fallback responses for when the LLM service is unavailable
FALLBACK_RESPONSES = [
    "I'm sorry, but I'm having trouble connecting to my knowledge base at the moment. Please try again in a few moments.",
    "It seems that my connection to the legal database is temporarily unavailable. Please try your question again shortly.",
    "I apologize for the inconvenience, but I can't access my full capabilities right now. This is a temporary issue that should resolve shortly.",
    "I'm currently experiencing some technical difficulties. Your question about legal matters is important, and I should be able to help you again soon."
]

# Alternative LLM endpoints to try if the primary one fails
ALTERNATIVE_ENDPOINTS = [
    "http://localhost:11434/api/generate",  # Default Ollama endpoint
    "http://localhost:11434/api/chat",      # Alternative Ollama endpoint
    "http://localhost:8000/v1/completions"  # Possible local API endpoint
]

def save_message(message):
    """Save a chat message to the history file"""
    try:
        history_file = os.path.join(CHAT_HISTORY_DIR, f"history_{datetime.now().strftime('%Y%m%d')}.jsonl")
        with open(history_file, 'a') as f:
            json.dump(message, f)
            f.write('\n')
    except Exception as e:
        current_app.logger.error(f"Failed to save message: {str(e)}")

def get_fallback_response():
    """Get a random fallback response when LLM service is unavailable"""
    return random.choice(FALLBACK_RESPONSES)

def get_static_tenant_rights_response():
    """Get a static response about tenant rights as a fallback"""
    return """
As a tenant, you generally have the following basic rights (though laws vary by location):

1. Right to habitable housing - Your landlord must provide housing that meets basic health and safety standards.
2. Right to privacy - Your landlord must give reasonable notice before entering your unit.
3. Right to security deposit return - Your landlord must return your security deposit within a specified timeframe.
4. Right to non-discrimination - Landlords cannot discriminate based on protected characteristics.
5. Protection against retaliation - Landlords cannot retaliate against you for exercising your legal rights.
6. Right to proper eviction procedures - Landlords must follow legal procedures for eviction.

For specific legal advice about your situation, please consult with a qualified attorney in your jurisdiction.
"""

@bp.route('/chat/history', methods=['GET'])
def get_chat_history():
    """Get chat history for the current day"""
    try:
        filename = f"chat_{datetime.now().strftime('%Y%m%d')}.json"
        filepath = os.path.join(CHAT_HISTORY_DIR, filename)
        
        if not os.path.exists(filepath):
            return jsonify([])
            
        with open(filepath, 'r') as f:
            messages = json.load(f)
            
        return jsonify(messages)
    except Exception as e:
        current_app.logger.error(f"Error getting chat history: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/chat', methods=['POST'])
def chat():
    """Handle legal chat requests with file support"""
    try:
        # Get message from JSON or form data
        if request.is_json:
            data = request.get_json()
            if not data:
                current_app.logger.error("No JSON data provided")
                return jsonify({'error': 'No JSON data provided'}), 400
            message = data.get('message', '')
        else:
            message = request.form.get('message', '')
            
        if not message:
            current_app.logger.error("No message provided")
            return jsonify({'error': 'No message provided'}), 400

        current_app.logger.info(f"Processing chat request with message: {message[:50]}...")

        # Initialize response
        response_data = {
            'messages': [],
            'status': 'success'
        }

        # Handle file uploads if present
        files = request.files.getlist('files') if not request.is_json else []
        uploaded_files = []
        
        for file in files:
            if file:
                filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
                filepath = os.path.join(CHAT_HISTORY_DIR, 'files', filename)
                os.makedirs(os.path.dirname(filepath), exist_ok=True)
                file.save(filepath)
                uploaded_files.append({
                    'name': file.filename,
                    'url': f'/api/legal/chat/files/{filename}'
                })

        # Save user message
        user_message = {
            'content': message,
            'sender': 'user',
            'files': uploaded_files,
            'timestamp': datetime.now().isoformat()
        }
        response_data['messages'].append(user_message)
        save_message(user_message)

        # Check if message is about tenant rights - special handling for this common query
        is_tenant_rights_query = 'tenant' in message.lower() and ('right' in message.lower() or 'law' in message.lower())
        
        # Prepare AI response
        ai_response = None
        provider = "fallback"
        success = False
        
        # Try to get response from LLM
        try:
            # Get AI response - use reduced timeout and try alternative endpoints if needed
            ollama_endpoint = os.getenv('OLLAMA_ENDPOINT', 'http://localhost:11434')
            current_app.logger.info(f"Making request to Ollama endpoint: {ollama_endpoint}")
            
            # First try primary endpoint with reduced timeout
            try:
                response = requests.post(
                    f"{ollama_endpoint}/api/generate",
                    headers={"Content-Type": "application/json"},
                    json={
                        "model": "mistral",
                        "prompt": message,
                        "stream": False
                    },
                    timeout=10  # Reduced timeout from 60 to 10 seconds
                )
                
                if response.status_code == 200:
                    result = response.json()
                    ai_response = result.get('response', '')
                    if ai_response:  # Check if response is not empty
                        success = True
                        provider = "ollama"
                    else:
                        current_app.logger.warning("Received empty response from primary endpoint")
            except requests.RequestException as e:
                current_app.logger.warning(f"Primary endpoint failed: {str(e)}")
                
            # If primary endpoint failed, try alternative endpoints
            if not success:
                for endpoint in ALTERNATIVE_ENDPOINTS[1:]:  # Skip the first one as we already tried it
                    try:
                        current_app.logger.info(f"Trying alternative endpoint: {endpoint}")
                        response = requests.post(
                            endpoint,
                            headers={"Content-Type": "application/json"},
                            json={
                                "model": "mistral",
                                "prompt": message,
                                "stream": False
                            },
                            timeout=5  # Even shorter timeout for fallbacks
                        )
                        
                        if response.status_code == 200:
                            result = response.json()
                            ai_response = result.get('response', '')
                            if ai_response:  # Check if response is not empty
                                success = True
                                provider = "ollama_alternative"
                                break
                            else:
                                current_app.logger.warning(f"Received empty response from alternative endpoint: {endpoint}")
                    except requests.RequestException as e:
                        current_app.logger.warning(f"Alternative endpoint {endpoint} failed: {str(e)}")
        except Exception as e:
            current_app.logger.error(f"Error getting AI response: {str(e)}")
        
        # If all endpoints failed or returned empty response, use fallback
        if not success or not ai_response:
            current_app.logger.warning("All AI endpoints failed, using fallback response")
            if is_tenant_rights_query:
                ai_response = get_static_tenant_rights_response()
                provider = "static_tenant_rights"
                current_app.logger.info("Using static tenant rights response")
            else:
                ai_response = get_fallback_response()
                provider = "fallback"
                current_app.logger.info(f"Using fallback response: {ai_response[:50]}...")
        
        # Save AI response
        ai_message = {
            'content': ai_response,
            'sender': 'ai',
            'model': 'mistral' if success else 'fallback',
            'provider': provider,
            'timestamp': datetime.now().isoformat()
        }
        response_data['messages'].append(ai_message)
        save_message(ai_message)
        
        current_app.logger.info("Successfully processed chat request")
        return jsonify(response_data)

    except Exception as e:
        current_app.logger.error(f"Chat endpoint error: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@bp.route('/chat/files/<filename>', methods=['GET'])
def get_chat_file(filename):
    """Get uploaded chat file"""
    try:
        filepath = os.path.join(CHAT_HISTORY_DIR, 'files', filename)
        if not os.path.exists(filepath):
            return jsonify({'error': 'File not found'}), 404
            
        return send_file(filepath, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/rights', methods=['POST'])
def explain_rights():
    """Handle legal rights explanation requests by calling Ollama API directly"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
            
        topic = data.get('topic')
        jurisdiction = data.get('jurisdiction')
        
        if not topic:
            return jsonify({'error': 'Topic is required'}), 400

        # Check if topic is about tenant rights - provide static response as a possible fallback
        is_tenant_rights_query = 'tenant' in topic.lower() and ('right' in topic.lower() or 'law' in topic.lower())
        
        ollama_endpoint = os.getenv('OLLAMA_ENDPOINT', 'http://localhost:11434')
        prompt = f"Explain legal rights regarding {topic}"
        if jurisdiction:
            prompt += f" in {jurisdiction}"
        
        # Initialize response variables
        explanation = None
        provider = "fallback"
        success = False
        
        # Try to get LLM response
        try:
            # Call Ollama API directly with reduced timeout
            response = requests.post(
                f"{ollama_endpoint}/api/generate",
                headers={"Content-Type": "application/json"},
                json={
                    "model": "mistral",
                    "prompt": prompt,
                    "stream": False
                },
                timeout=10  # Reduced timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                explanation = result.get('response', '')
                if explanation:  # Check if response is not empty
                    success = True
                    provider = "ollama"
                    return jsonify({
                        'explanation': explanation,
                        'model': 'mistral',
                        'provider': provider,
                        'tokens': result.get('eval_count', 0),
                        'status': 'success'
                    })
                else:
                    current_app.logger.warning("Received empty response from primary endpoint")
            else:
                current_app.logger.warning(f"Primary endpoint returned status code: {response.status_code}")
                
            # Try alternative endpoint if primary failed
            try:
                current_app.logger.info("Trying alternative Ollama endpoint")
                response = requests.post(
                    "http://localhost:11434/api/chat",
                    headers={"Content-Type": "application/json"},
                    json={
                        "model": "mistral",
                        "prompt": prompt,
                        "stream": False
                    },
                    timeout=5
                )
                
                if response.status_code == 200:
                    result = response.json()
                    explanation = result.get('response', '')
                    if explanation:  # Check if response is not empty
                        success = True
                        provider = "ollama_alternative"
                        return jsonify({
                            'explanation': explanation,
                            'model': 'mistral',
                            'provider': provider,
                            'tokens': result.get('eval_count', 0),
                            'status': 'success'
                        })
                    else:
                        current_app.logger.warning("Received empty response from alternative endpoint")
            except Exception as e:
                current_app.logger.warning(f"Alternative endpoint failed: {str(e)}")
        except Exception as e:
            current_app.logger.error(f"Error getting AI response: {str(e)}")
        
        # If all endpoints failed or returned empty responses, use fallback
        current_app.logger.warning("All AI endpoints failed, using fallback response")
        if is_tenant_rights_query:
            explanation = get_static_tenant_rights_response()
            provider = "static_tenant_rights"
            current_app.logger.info("Using static tenant rights response")
        else:
            explanation = get_fallback_response()
            provider = "fallback"
            current_app.logger.info(f"Using fallback response: {explanation[:50]}...")
            
        return jsonify({
            'explanation': explanation,
            'model': 'fallback',
            'provider': provider,
            'tokens': 0,
            'status': 'fallback'
        })

    except Exception as e:
        current_app.logger.error(f"Rights endpoint error: {str(e)}")
        return jsonify({'error': str(e)}), 500 