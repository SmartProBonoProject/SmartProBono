from flask import Blueprint, jsonify, request, g
from services.priority_queue_service import priority_queue_service
from utils.auth import require_permission, require_role
from services.audit_trail import audit_trail_service
import time

# Rate limiting settings
REQUEST_LIMIT = 60  # Number of requests
RATE_LIMIT_WINDOW = 60  # Seconds
request_counter = {}

def rate_limit(user_id):
    """Basic rate limiting implementation"""
    current_time = time.time()
    
    # Initialize or clean up expired entries
    if user_id not in request_counter:
        request_counter[user_id] = {'count': 0, 'start_time': current_time}
    elif current_time - request_counter[user_id]['start_time'] > RATE_LIMIT_WINDOW:
        request_counter[user_id] = {'count': 0, 'start_time': current_time}
        
    # Increment request count
    request_counter[user_id]['count'] += 1
    
    # Check if rate limit exceeded
    if request_counter[user_id]['count'] > REQUEST_LIMIT:
        return True
        
    return False

priority_queue_routes = Blueprint('priority_queue_routes', __name__)

@priority_queue_routes.route('/api/priority-queue/case', methods=['POST'])
@require_permission('manage_queue')
def add_case():
    """Add a new case to the priority queue"""
    try:
        # Apply rate limiting
        if rate_limit(g.user.get('user_id')):
            return jsonify({'error': 'Rate limit exceeded'}), 429
            
        data = request.get_json()
        required_fields = ['case_id', 'priority', 'user_id', 'situation_type']
        
        if not all(field in data for field in required_fields):
            return jsonify({
                'error': f'Missing required fields. Required: {", ".join(required_fields)}'
            }), 400
            
        case = priority_queue_service.add_case(
            case_id=data['case_id'],
            priority=data['priority'],
            user_id=data['user_id'],
            situation_type=data['situation_type'],
            metadata=data.get('metadata', {})
        )
        
        # Get estimated wait time
        wait_time = priority_queue_service.get_estimated_wait_time(case.case_id)
        position = priority_queue_service.get_queue_position(case.case_id)
        
        # Log audit event
        audit_trail_service.log_event(
            entity_id=case.case_id,
            event_type='case_added_to_queue',
            user_id=g.user.get('user_id'),
            details={
                'priority': case.priority.name,
                'situation_type': case.situation_type,
                'queue_position': position,
                'estimated_wait_time': str(wait_time) if wait_time else None
            }
        )
        
        return jsonify({
            'case_id': case.case_id,
            'priority': case.priority.name,
            'queue_position': position,
            'estimated_wait_time': str(wait_time) if wait_time else None
        }), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@priority_queue_routes.route('/api/priority-queue/case/<case_id>', methods=['PUT'])
@require_permission('manage_queue')
def update_case_priority(case_id):
    """Update the priority of a case"""
    try:
        # Apply rate limiting
        if rate_limit(g.user.get('user_id')):
            return jsonify({'error': 'Rate limit exceeded'}), 429
            
        data = request.get_json()
        if 'priority' not in data:
            return jsonify({'error': 'New priority level is required'}), 400
            
        # Get old priority for audit
        old_priority = None
        case_info = priority_queue_service.get_case(case_id)
        if case_info:
            old_priority = case_info.priority.name
            
        case = priority_queue_service.update_priority(case_id, data['priority'])
        if not case:
            return jsonify({'error': 'Case not found'}), 404
            
        wait_time = priority_queue_service.get_estimated_wait_time(case.case_id)
        position = priority_queue_service.get_queue_position(case.case_id)
        
        # Log audit event
        audit_trail_service.log_event(
            entity_id=case.case_id,
            event_type='case_priority_updated',
            user_id=g.user.get('user_id'),
            details={
                'old_priority': old_priority,
                'new_priority': case.priority.name,
                'new_queue_position': position,
                'new_estimated_wait_time': str(wait_time) if wait_time else None
            }
        )
        
        return jsonify({
            'case_id': case.case_id,
            'priority': case.priority.name,
            'queue_position': position,
            'estimated_wait_time': str(wait_time) if wait_time else None
        })
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@priority_queue_routes.route('/api/priority-queue/case/<case_id>/assign', methods=['POST'])
@require_role('lawyer', 'admin', 'superadmin')
def assign_case(case_id):
    """Assign a case to a lawyer"""
    try:
        # Apply rate limiting
        if rate_limit(g.user.get('user_id')):
            return jsonify({'error': 'Rate limit exceeded'}), 429
            
        data = request.get_json()
        if 'lawyer_id' not in data:
            return jsonify({'error': 'Lawyer ID is required'}), 400
            
        case = priority_queue_service.assign_case(case_id, data['lawyer_id'])
        if not case:
            return jsonify({'error': 'Case not found'}), 404
            
        # Log audit event
        audit_trail_service.log_event(
            entity_id=case.case_id,
            event_type='case_assigned',
            user_id=g.user.get('user_id'),
            details={
                'lawyer_id': case.assigned_lawyer_id,
                'assignment_time': case.timestamp.isoformat()
            }
        )
        
        return jsonify({
            'case_id': case.case_id,
            'lawyer_id': case.assigned_lawyer_id,
            'status': 'assigned'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@priority_queue_routes.route('/api/priority-queue/case/<case_id>/status', methods=['GET'])
@require_permission('view_queue')
def get_case_status(case_id):
    """Get the current status of a case in the queue"""
    try:
        # Apply rate limiting
        if rate_limit(g.user.get('user_id')):
            return jsonify({'error': 'Rate limit exceeded'}), 429
            
        position = priority_queue_service.get_queue_position(case_id)
        if position is None:
            return jsonify({'error': 'Case not found'}), 404
            
        wait_time = priority_queue_service.get_estimated_wait_time(case_id)
        
        # Log view event (lower detail level for read operations)
        audit_trail_service.log_event(
            entity_id=case_id,
            event_type='case_status_viewed',
            user_id=g.user.get('user_id'),
            details={}
        )
        
        return jsonify({
            'case_id': case_id,
            'queue_position': position,
            'estimated_wait_time': str(wait_time) if wait_time else None
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@priority_queue_routes.route('/api/priority-queue/status', methods=['GET'])
@require_permission('view_queue')
def get_queue_status():
    """Get the current status of the entire queue"""
    try:
        # Apply rate limiting
        if rate_limit(g.user.get('user_id')):
            return jsonify({'error': 'Rate limit exceeded'}), 429
            
        status = priority_queue_service.get_queue_status()
        
        # Log view event
        audit_trail_service.log_event(
            entity_id='queue',
            event_type='queue_status_viewed',
            user_id=g.user.get('user_id'),
            details={}
        )
        
        return jsonify(status)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# New endpoint for queue analytics
@priority_queue_routes.route('/api/priority-queue/analytics', methods=['GET'])
@require_permission('admin_actions')
def get_queue_analytics():
    """Get queue performance analytics"""
    try:
        # Apply rate limiting
        if rate_limit(g.user.get('user_id')):
            return jsonify({'error': 'Rate limit exceeded'}), 429
            
        analytics = priority_queue_service.get_queue_analytics()
        
        # Log analytics access
        audit_trail_service.log_event(
            entity_id='queue',
            event_type='queue_analytics_accessed',
            user_id=g.user.get('user_id'),
            details={}
        )
        
        return jsonify(analytics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# New endpoint for queue history and audit logs
@priority_queue_routes.route('/api/priority-queue/audit', methods=['GET'])
@require_permission('admin_actions')
def get_queue_audit_log():
    """Get queue audit logs"""
    try:
        # Apply rate limiting
        if rate_limit(g.user.get('user_id')):
            return jsonify({'error': 'Rate limit exceeded'}), 429
            
        # Get audit logs for the queue
        audit_logs = audit_trail_service.get_audit_trail('queue')
        
        # Log audit trail access
        audit_trail_service.log_event(
            entity_id='queue',
            event_type='queue_audit_logs_accessed',
            user_id=g.user.get('user_id'),
            details={}
        )
        
        return jsonify(audit_logs)
    except Exception as e:
        return jsonify({'error': str(e)}), 500 