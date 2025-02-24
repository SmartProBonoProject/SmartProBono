from flask import Blueprint, request, jsonify
from datetime import datetime
from bson import ObjectId
from database import db

documents = Blueprint('documents', __name__, url_prefix='/api/documents')

@documents.route('/<document_id>', methods=['GET'])
def get_document(document_id):
    try:
        document = db.documents.find_one({'_id': ObjectId(document_id)})
        if not document:
            return jsonify({'error': 'Document not found'}), 404
            
        # Convert ObjectId to string for JSON serialization
        document['_id'] = str(document['_id'])
        return jsonify(document)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@documents.route('/<document_id>', methods=['PUT'])
def update_document(document_id):
    try:
        data = request.get_json()
        
        # Get the current document to preserve history
        current_doc = db.documents.find_one({'_id': ObjectId(document_id)})
        if not current_doc:
            return jsonify({'error': 'Document not found'}), 404
            
        # Add current version to history
        if 'content' in data and data['content'] != current_doc.get('content'):
            history_entry = {
                'content': current_doc.get('content'),
                'timestamp': datetime.utcnow(),
                'version': len(current_doc.get('history', [])) + 1
            }
            
            # Update document with new content and add to history
            update_data = {
                '$set': {
                    'content': data['content'],
                    'lastModified': datetime.utcnow(),
                    **{k: v for k, v in data.items() if k not in ['content', 'history']}
                },
                '$push': {'history': history_entry}
            }
        else:
            # Update document without modifying history
            update_data = {
                '$set': {
                    'lastModified': datetime.utcnow(),
                    **{k: v for k, v in data.items() if k != 'history'}
                }
            }
            
        result = db.documents.update_one(
            {'_id': ObjectId(document_id)},
            update_data
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Document not found or no changes made'}), 404
            
        # Return updated document
        updated_doc = db.documents.find_one({'_id': ObjectId(document_id)})
        updated_doc['_id'] = str(updated_doc['_id'])
        return jsonify(updated_doc)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@documents.route('/', methods=['POST'])
def create_document():
    try:
        data = request.get_json()
        required_fields = ['title', 'content', 'type']
        
        # Validate required fields
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
                
        # Add metadata
        document = {
            **data,
            'createdAt': datetime.utcnow(),
            'lastModified': datetime.utcnow(),
            'history': []
        }
        
        # Insert document
        result = db.documents.insert_one(document)
        
        # Return created document
        document['_id'] = str(result.inserted_id)
        return jsonify(document), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@documents.route('/<document_id>/versions', methods=['GET'])
def get_document_versions(document_id):
    try:
        document = db.documents.find_one({'_id': ObjectId(document_id)})
        if not document:
            return jsonify({'error': 'Document not found'}), 404
            
        versions = document.get('history', [])
        # Add current version
        versions.append({
            'content': document['content'],
            'timestamp': document['lastModified'],
            'version': len(versions) + 1,
            'isCurrent': True
        })
        
        return jsonify(versions)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@documents.route('/<document_id>/versions/<int:version>', methods=['POST'])
def revert_to_version(document_id, version):
    try:
        document = db.documents.find_one({'_id': ObjectId(document_id)})
        if not document:
            return jsonify({'error': 'Document not found'}), 404
            
        history = document.get('history', [])
        if version < 1 or version > len(history):
            return jsonify({'error': 'Invalid version number'}), 400
            
        # Get the content from the specified version
        target_version = history[version - 1]
        
        # Add current version to history
        history_entry = {
            'content': document['content'],
            'timestamp': datetime.utcnow(),
            'version': len(history) + 1
        }
        
        # Update document with old version's content
        result = db.documents.update_one(
            {'_id': ObjectId(document_id)},
            {
                '$set': {
                    'content': target_version['content'],
                    'lastModified': datetime.utcnow()
                },
                '$push': {'history': history_entry}
            }
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Failed to revert document'}), 500
            
        return jsonify({'message': 'Document reverted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@documents.route('/<document_id>/share', methods=['POST'])
def share_document(document_id):
    try:
        data = request.get_json()
        if 'users' not in data:
            return jsonify({'error': 'Missing users to share with'}), 400
            
        # Update document with shared users
        result = db.documents.update_one(
            {'_id': ObjectId(document_id)},
            {
                '$addToSet': {
                    'sharedWith': {'$each': data['users']}
                }
            }
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Document not found'}), 404
            
        return jsonify({'message': 'Document shared successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 