from flask import Blueprint, request, jsonify

bp = Blueprint('documents', __name__, url_prefix='/api/documents')

@bp.route('/generate', methods=['POST'])
def generate_document():
    # Document generation logic
    return jsonify({"message": "Document generation endpoint"}) 