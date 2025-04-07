from flask import Blueprint, request, jsonify
from services.case_service import case_service

# Create a blueprint for case-related routes
case_routes = Blueprint('case_routes', __name__)

@case_routes.route('/api/cases', methods=['GET'])
def get_cases():
    """
    Get all cases, optionally filtered by query parameters.
    
    Query Parameters:
        status (str, optional): Filter by case status
        type (str, optional): Filter by case type
        priority (str, optional): Filter by priority level
        client_id (str, optional): Filter by client ID
        assigned_to_id (str, optional): Filter by assigned user ID
    
    Returns:
        JSON: List of cases matching the filters
    """
    # Extract query parameters for filtering
    filters = {}
    
    status = request.args.get('status')
    if status and status != 'all':
        filters['status'] = status
        
    case_type = request.args.get('type')
    if case_type and case_type != 'all':
        filters['type'] = case_type
        
    priority = request.args.get('priority')
    if priority and priority != 'all':
        filters['priority'] = priority
        
    client_id = request.args.get('client_id')
    if client_id:
        filters['client.id'] = client_id
        
    assigned_to_id = request.args.get('assigned_to_id')
    if assigned_to_id:
        filters['assignedTo.id'] = assigned_to_id
    
    # Get cases with filters, or all cases if no filters
    if filters:
        cases = case_service.filter_cases(filters)
    else:
        cases = case_service.get_all_cases()
    
    return jsonify(cases)

@case_routes.route('/api/cases/<case_id>', methods=['GET'])
def get_case(case_id):
    """
    Get a specific case by ID.
    
    Parameters:
        case_id (str): The ID of the case to retrieve
    
    Returns:
        JSON: The case data or 404 error if not found
    """
    case = case_service.get_case_by_id(case_id)
    
    if not case:
        return jsonify({'error': 'Case not found'}), 404
    
    return jsonify(case)

@case_routes.route('/api/cases', methods=['POST'])
def create_case():
    """
    Create a new case.
    
    Request Body:
        JSON object with case data
    
    Returns:
        JSON: The created case with its assigned ID
    """
    case_data = request.json
    
    if not case_data:
        return jsonify({'error': 'Missing case data'}), 400
    
    # Validate required fields
    required_fields = ['title', 'type', 'status', 'priority']
    missing_fields = [field for field in required_fields if field not in case_data]
    
    if missing_fields:
        return jsonify({
            'error': f"Missing required fields: {', '.join(missing_fields)}"
        }), 400
    
    # Create the case
    created_case = case_service.create_case(case_data)
    
    return jsonify(created_case), 201

@case_routes.route('/api/cases/<case_id>', methods=['PUT'])
def update_case(case_id):
    """
    Update an existing case.
    
    Parameters:
        case_id (str): The ID of the case to update
    
    Request Body:
        JSON object with case data to update
    
    Returns:
        JSON: The updated case or 404 error if not found
    """
    update_data = request.json
    
    if not update_data:
        return jsonify({'error': 'Missing update data'}), 400
    
    updated_case = case_service.update_case(case_id, update_data)
    
    if not updated_case:
        return jsonify({'error': 'Case not found'}), 404
    
    return jsonify(updated_case)

@case_routes.route('/api/cases/<case_id>', methods=['DELETE'])
def delete_case(case_id):
    """
    Delete a case.
    
    Parameters:
        case_id (str): The ID of the case to delete
    
    Returns:
        JSON: Success message or 404 error if not found
    """
    result = case_service.delete_case(case_id)
    
    if not result:
        return jsonify({'error': 'Case not found'}), 404
    
    return jsonify({'message': 'Case deleted successfully'})

@case_routes.route('/api/cases/<case_id>/timeline', methods=['POST'])
def add_timeline_event(case_id):
    """
    Add a timeline event to a case.
    
    Parameters:
        case_id (str): The ID of the case
    
    Request Body:
        JSON object with event data
    
    Returns:
        JSON: The updated case or 404 error if not found
    """
    event_data = request.json
    
    if not event_data:
        return jsonify({'error': 'Missing event data'}), 400
    
    # Validate required fields
    required_fields = ['type', 'description']
    missing_fields = [field for field in required_fields if field not in event_data]
    
    if missing_fields:
        return jsonify({
            'error': f"Missing required fields: {', '.join(missing_fields)}"
        }), 400
    
    updated_case = case_service.add_timeline_event(case_id, event_data)
    
    if not updated_case:
        return jsonify({'error': 'Case not found'}), 404
    
    return jsonify(updated_case)

@case_routes.route('/api/cases/<case_id>/documents', methods=['POST'])
def add_document(case_id):
    """
    Add a document to a case.
    
    Parameters:
        case_id (str): The ID of the case
    
    Request Body:
        JSON object with document data
    
    Returns:
        JSON: The updated case or 404 error if not found
    """
    document_data = request.json
    
    if not document_data:
        return jsonify({'error': 'Missing document data'}), 400
    
    # Validate required fields
    required_fields = ['title', 'type']
    missing_fields = [field for field in required_fields if field not in document_data]
    
    if missing_fields:
        return jsonify({
            'error': f"Missing required fields: {', '.join(missing_fields)}"
        }), 400
    
    updated_case = case_service.add_document(case_id, document_data)
    
    if not updated_case:
        return jsonify({'error': 'Case not found'}), 404
    
    return jsonify(updated_case)

@case_routes.route('/api/cases/<case_id>/next-steps', methods=['POST'])
def add_next_step(case_id):
    """
    Add a next step to a case.
    
    Parameters:
        case_id (str): The ID of the case
    
    Request Body:
        JSON object with step data
    
    Returns:
        JSON: The updated case or 404 error if not found
    """
    step_data = request.json
    
    if not step_data:
        return jsonify({'error': 'Missing step data'}), 400
    
    # Validate required fields
    required_fields = ['description', 'dueDate']
    missing_fields = [field for field in required_fields if field not in step_data]
    
    if missing_fields:
        return jsonify({
            'error': f"Missing required fields: {', '.join(missing_fields)}"
        }), 400
    
    updated_case = case_service.add_next_step(case_id, step_data)
    
    if not updated_case:
        return jsonify({'error': 'Case not found'}), 404
    
    return jsonify(updated_case)

@case_routes.route('/api/cases/<case_id>/next-steps/<step_id>', methods=['PUT'])
def update_next_step(case_id, step_id):
    """
    Update a next step in a case.
    
    Parameters:
        case_id (str): The ID of the case
        step_id (str): The ID of the step to update
    
    Request Body:
        JSON object with step data to update
    
    Returns:
        JSON: The updated case or 404 error if not found
    """
    update_data = request.json
    
    if not update_data:
        return jsonify({'error': 'Missing update data'}), 400
    
    updated_case = case_service.update_next_step(case_id, step_id, update_data)
    
    if not updated_case:
        return jsonify({'error': 'Case or step not found'}), 404
    
    return jsonify(updated_case) 