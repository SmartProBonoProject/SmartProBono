from flask import Blueprint, request, jsonify
from services.case_service import CaseService, CaseStatus, CasePriority
from utils.auth import require_auth

cases = Blueprint('cases', __name__)
case_service = CaseService()

@cases.route('/api/cases', methods=['GET'])
@require_auth
def get_cases():
    """Get all cases with optional filters."""
    filters = {
        'status': request.args.get('status'),
        'type': request.args.get('type'),
        'priority': request.args.get('priority'),
        'assigned_to': request.args.get('assigned_to'),
        'client_id': request.args.get('client_id')
    }
    
    # Remove None values from filters
    filters = {k: v for k, v in filters.items() if v is not None}
    
    cases = case_service.filter_cases(filters)
    return jsonify(cases)

@cases.route('/api/cases/<case_id>', methods=['GET'])
@require_auth
def get_case(case_id):
    """Get a specific case by ID."""
    case = case_service.get_case_by_id(case_id)
    if not case:
        return jsonify({'error': 'Case not found'}), 404
    return jsonify(case)

@cases.route('/api/cases', methods=['POST'])
@require_auth
def create_case():
    """Create a new case."""
    data = request.get_json()
    
    required_fields = ['title', 'description', 'type']
    if not all(field in data for field in required_fields):
        return jsonify({
            'error': 'Missing required fields',
            'required': required_fields
        }), 400
    
    case = case_service.create_case(data)
    return jsonify(case), 201

@cases.route('/api/cases/<case_id>', methods=['PUT'])
@require_auth
def update_case(case_id):
    """Update an existing case."""
    data = request.get_json()
    
    # Validate status if it's being updated
    if 'status' in data and data['status'] not in vars(CaseStatus).values():
        return jsonify({
            'error': 'Invalid status',
            'valid_statuses': list(vars(CaseStatus).values())
        }), 400
    
    # Validate priority if it's being updated
    if 'priority' in data and data['priority'] not in vars(CasePriority).values():
        return jsonify({
            'error': 'Invalid priority',
            'valid_priorities': list(vars(CasePriority).values())
        }), 400
    
    case = case_service.update_case(case_id, data)
    if not case:
        return jsonify({'error': 'Case not found'}), 404
    return jsonify(case)

@cases.route('/api/cases/<case_id>/assign', methods=['POST'])
@require_auth
def assign_case(case_id):
    """Assign a case to a user."""
    data = request.get_json()
    
    if 'user_id' not in data:
        return jsonify({'error': 'user_id is required'}), 400
    
    case = case_service.assign_case(
        case_id,
        data['user_id'],
        data.get('notes', '')
    )
    
    if not case:
        return jsonify({'error': 'Case not found'}), 404
    return jsonify(case)

@cases.route('/api/cases/<case_id>/priority', methods=['PUT'])
@require_auth
def update_case_priority(case_id):
    """Update a case's priority."""
    data = request.get_json()
    
    if 'priority' not in data:
        return jsonify({'error': 'priority is required'}), 400
        
    try:
        case = case_service.update_priority(
            case_id,
            data['priority'],
            data.get('notes', '')
        )
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    
    if not case:
        return jsonify({'error': 'Case not found'}), 404
    return jsonify(case)

@cases.route('/api/cases/<case_id>/history', methods=['GET'])
@require_auth
def get_case_history(case_id):
    """Get the status history of a case."""
    history = case_service.get_case_history(case_id)
    if history is None:
        return jsonify({'error': 'Case not found'}), 404
    return jsonify(history)

@cases.route('/api/cases/<case_id>/timeline', methods=['POST'])
@require_auth
def add_timeline_event(case_id):
    """Add a timeline event to a case."""
    data = request.get_json()
    
    if 'description' not in data:
        return jsonify({'error': 'description is required'}), 400
    
    case = case_service.add_timeline_event(case_id, data)
    if not case:
        return jsonify({'error': 'Case not found'}), 404
    return jsonify(case)

@cases.route('/api/cases/<case_id>/documents', methods=['POST'])
@require_auth
def add_document(case_id):
    """Add a document to a case."""
    data = request.get_json()
    
    required_fields = ['name', 'type', 'url']
    if not all(field in data for field in required_fields):
        return jsonify({
            'error': 'Missing required fields',
            'required': required_fields
        }), 400
    
    case = case_service.add_document(case_id, data)
    if not case:
        return jsonify({'error': 'Case not found'}), 404
    return jsonify(case)

@cases.route('/api/cases/<case_id>/next-steps', methods=['POST'])
@require_auth
def add_next_step(case_id):
    """Add a next step to a case."""
    data = request.get_json()
    
    required_fields = ['description', 'due_date']
    if not all(field in data for field in required_fields):
        return jsonify({
            'error': 'Missing required fields',
            'required': required_fields
        }), 400
    
    case = case_service.add_next_step(case_id, data)
    if not case:
        return jsonify({'error': 'Case not found'}), 404
    return jsonify(case)

@cases.route('/api/cases/<case_id>/next-steps/<step_id>', methods=['PUT'])
@require_auth
def update_next_step(case_id, step_id):
    """Update a next step in a case."""
    data = request.get_json()
    
    case = case_service.update_next_step(case_id, step_id, data)
    if not case:
        return jsonify({'error': 'Case or step not found'}), 404
    return jsonify(case) 