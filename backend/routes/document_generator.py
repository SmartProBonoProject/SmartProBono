"""
Document Generator API routes
Provides endpoints for generating legal documents
"""
from flask import Blueprint, request, jsonify, send_file, current_app
import os
import json
from datetime import datetime
from models.database import db

bp = Blueprint('document_generator', __name__, url_prefix='/api/documents')

# Document templates directory
TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../templates')
if not os.path.exists(TEMPLATES_DIR):
    os.makedirs(TEMPLATES_DIR)

@bp.route('/templates', methods=['GET'])
def get_templates():
    """Get available document templates - no auth required"""
    try:
        templates = [
            {
                'id': 'rental-agreement',
                'name': 'Rental Agreement',
                'category': 'Housing',
                'description': 'Basic rental/lease agreement template',
                'fields': ['landlord_name', 'tenant_name', 'property_address', 'rent_amount', 'lease_term']
            },
            {
                'id': 'power-of-attorney',
                'name': 'Power of Attorney',
                'category': 'Legal',
                'description': 'General power of attorney document',
                'fields': ['grantor_name', 'agent_name', 'powers_granted', 'effective_date']
            },
            {
                'id': 'demand-letter',
                'name': 'Demand Letter',
                'category': 'Disputes',
                'description': 'Template for formal demand letter',
                'fields': ['sender_name', 'recipient_name', 'demand_amount', 'reason', 'deadline']
            }
        ]
        return jsonify(templates)
    except Exception as e:
        current_app.logger.error(f"Error getting templates: {str(e)}")
        return jsonify({'error': 'Could not fetch templates'}), 500

@bp.route('/generate', methods=['POST'])
def generate_document():
    """Generate a document from template - no auth required"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        template_id = data.get('template_id')
        if not template_id:
            return jsonify({'error': 'Template ID is required'}), 400

        # Generate document based on template and user input
        document_content = generate_document_content(template_id, data)
        
        # Save generated document
        filename = f"document_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        filepath = os.path.join(TEMPLATES_DIR, filename)
        
        # Save document content to file
        with open(filepath, 'w') as f:
            json.dump(document_content, f, indent=2)
        
        return jsonify({
            'message': 'Document generated successfully',
            'document': {
                'filename': filename,
                'download_url': f'/api/documents/download/{filename}'
            }
        })
    except Exception as e:
        current_app.logger.error(f"Error generating document: {str(e)}")
        return jsonify({'error': 'Could not generate document'}), 500

def generate_document_content(template_id, data):
    """Generate document content based on template and user input"""
    # TODO: Implement actual document generation logic
    # For MVP, return structured data
    return {
        'template_id': template_id,
        'generated_at': datetime.now().isoformat(),
        'content': data
    }

@bp.route('/download/<filename>', methods=['GET'])
def download_document(filename):
    """Download generated document - no auth required"""
    try:
        filepath = os.path.join(TEMPLATES_DIR, filename)
        if not os.path.exists(filepath):
            return jsonify({'error': 'Document not found'}), 404
            
        return send_file(filepath, as_attachment=True)
    except Exception as e:
        current_app.logger.error(f"Error downloading document: {str(e)}")
        return jsonify({'error': 'Could not download document'}), 500
