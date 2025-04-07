from flask import Blueprint, request, jsonify, current_app
from models.user import User
from models.database import db
from datetime import datetime
from routes.auth import token_required
import json

bp = Blueprint('matching', __name__)

def calculate_match_score(client, attorney):
    """Calculate match score between client and attorney"""
    score = 0
    max_score = 100
    
    # Match based on legal issue type and practice areas
    if attorney.practice_areas and client.legal_issue_type:
        if client.legal_issue_type in attorney.practice_areas.split(','):
            score += 40  # Highest weight for matching practice area
    
    # Match based on languages
    if attorney.languages and hasattr(client, 'preferred_language'):
        if client.preferred_language in attorney.languages.split(','):
            score += 20
    
    # Match based on location (state)
    if attorney.state and client.state and attorney.state == client.state:
        score += 20
    
    # Match based on availability
    if attorney.availability:
        try:
            availability = json.loads(attorney.availability)
            # Add score based on hours available per week
            hours_per_week = sum(len(day['hours']) for day in availability if day.get('hours'))
            score += min(20, hours_per_week)  # Cap at 20 points
        except:
            pass
    
    return (score / max_score) * 100

@bp.route('/find-attorneys', methods=['POST'])
@token_required
def find_attorneys(current_user):
    """Find matching attorneys for a client"""
    if current_user.role != 'client':
        return jsonify({'error': 'Only clients can search for attorneys'}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No search criteria provided'}), 400
    
    # Get all attorneys
    attorneys = User.query.filter_by(role='attorney', is_verified=True).all()
    
    # Calculate match scores
    matches = []
    for attorney in attorneys:
        score = calculate_match_score(current_user, attorney)
        if score >= 50:  # Only include matches above 50%
            attorney_dict = attorney.to_dict()
            attorney_dict['match_score'] = score
            matches.append(attorney_dict)
    
    # Sort by match score
    matches.sort(key=lambda x: x['match_score'], reverse=True)
    
    return jsonify({
        'matches': matches[:10]  # Return top 10 matches
    })

@bp.route('/request-attorney/<int:attorney_id>', methods=['POST'])
@token_required
def request_attorney(current_user, attorney_id):
    """Request to connect with an attorney"""
    if current_user.role != 'client':
        return jsonify({'error': 'Only clients can request attorneys'}), 403
    
    attorney = User.query.get(attorney_id)
    if not attorney or attorney.role != 'attorney':
        return jsonify({'error': 'Attorney not found'}), 404
    
    data = request.get_json() or {}
    
    try:
        # Create connection request
        request_data = {
            'client_id': current_user.id,
            'attorney_id': attorney_id,
            'status': 'pending',
            'message': data.get('message', ''),
            'legal_issue_type': current_user.legal_issue_type,
            'case_description': current_user.case_description,
            'created_at': datetime.utcnow().isoformat()
        }
        
        # Store in database (implement this based on your database schema)
        # For MVP, we'll return the request data
        
        # TODO: Send notification to attorney
        
        return jsonify({
            'message': 'Connection request sent successfully',
            'request': request_data
        })
        
    except Exception as e:
        current_app.logger.error(f"Error creating connection request: {str(e)}")
        return jsonify({'error': 'Could not create connection request'}), 500

@bp.route('/attorney/requests', methods=['GET'])
@token_required
def get_attorney_requests(current_user):
    """Get connection requests for an attorney"""
    if current_user.role != 'attorney':
        return jsonify({'error': 'Only attorneys can view requests'}), 403
    
    # TODO: Implement fetching requests from database
    # For MVP, return empty list
    return jsonify({
        'requests': []
    })

@bp.route('/attorney/respond/<int:request_id>', methods=['POST'])
@token_required
def respond_to_request(current_user, request_id):
    """Respond to a connection request"""
    if current_user.role != 'attorney':
        return jsonify({'error': 'Only attorneys can respond to requests'}), 403
    
    data = request.get_json()
    if not data or 'action' not in data:
        return jsonify({'error': 'Action (accept/reject) is required'}), 400
    
    action = data['action']
    if action not in ['accept', 'reject']:
        return jsonify({'error': 'Invalid action'}), 400
    
    # TODO: Implement updating request in database
    # For MVP, return success message
    
    return jsonify({
        'message': f'Request {action}ed successfully'
    })

@bp.route('/client/requests', methods=['GET'])
@token_required
def get_client_requests(current_user):
    """Get connection requests made by a client"""
    if current_user.role != 'client':
        return jsonify({'error': 'Only clients can view their requests'}), 403
    
    # TODO: Implement fetching requests from database
    # For MVP, return empty list
    return jsonify({
        'requests': []
    }) 