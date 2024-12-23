from flask import Blueprint, request, jsonify

bp = Blueprint('immigration', __name__, url_prefix='/api/immigration')

@bp.route('/status', methods=['GET'])
def get_immigration_status():
    return jsonify({"message": "Immigration status endpoint"}) 