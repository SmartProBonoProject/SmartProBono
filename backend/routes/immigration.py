from flask import Blueprint, request, jsonify
from datetime import datetime
from bson import ObjectId
from database import db

immigration = Blueprint('immigration', __name__, url_prefix='/api/immigration')

@immigration.route('/cases', methods=['GET'])
def get_cases():
    try:
        cases = list(db.immigration_cases.find())
        # Convert ObjectId to string for JSON serialization
        for case in cases:
            case['_id'] = str(case['_id'])
        return jsonify(cases)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@immigration.route('/cases', methods=['POST'])
def create_case():
    try:
        case_data = request.get_json()
        required_fields = ['clientName', 'caseType', 'status']
        
        # Validate required fields
        for field in required_fields:
            if field not in case_data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Add timestamps
        case_data['createdAt'] = datetime.utcnow()
        case_data['updatedAt'] = datetime.utcnow()
        
        # Insert into database
        result = db.immigration_cases.insert_one(case_data)
        
        # Return the created case
        case_data['_id'] = str(result.inserted_id)
        return jsonify(case_data), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@immigration.route('/cases/<case_id>', methods=['PUT'])
def update_case(case_id):
    try:
        case_data = request.get_json()
        case_data['updatedAt'] = datetime.utcnow()
        
        # Update in database
        result = db.immigration_cases.update_one(
            {'_id': ObjectId(case_id)},
            {'$set': case_data}
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Case not found'}), 404
            
        # Return the updated case
        case_data['_id'] = case_id
        return jsonify(case_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@immigration.route('/cases/<case_id>', methods=['DELETE'])
def delete_case(case_id):
    try:
        result = db.immigration_cases.delete_one({'_id': ObjectId(case_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Case not found'}), 404
            
        return jsonify({'message': 'Case deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@immigration.route('/cases/<case_id>/documents', methods=['POST'])
def upload_document():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['file']
        case_id = request.form.get('caseId')
        
        if not file.filename:
            return jsonify({'error': 'No file selected'}), 400
            
        # TODO: Implement file storage (e.g., using S3 or local filesystem)
        # For now, just return success
        return jsonify({'message': 'Document uploaded successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@immigration.route('/cases/<case_id>/documents', methods=['GET'])
def get_documents(case_id):
    try:
        case = db.immigration_cases.find_one({'_id': ObjectId(case_id)})
        if not case:
            return jsonify({'error': 'Case not found'}), 404
            
        documents = case.get('documents', [])
        return jsonify(documents)
    except Exception as e:
        return jsonify({'error': str(e)}), 500 