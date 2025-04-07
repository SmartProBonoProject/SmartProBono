import json
import os
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any, Union

class CaseStatus:
    NEW = "new"
    IN_PROGRESS = "in_progress"
    UNDER_REVIEW = "under_review"
    ON_HOLD = "on_hold"
    CLOSED = "closed"

class CasePriority:
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class CaseService:
    """
    Service for managing legal cases.
    
    This service provides methods for creating, retrieving, updating, and
    deleting case records. It uses a JSON file for storage in this prototype,
    but would connect to a database in a production environment.
    """
    
    def __init__(self):
        """Initialize the service and ensure data file exists."""
        self.data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
        self.cases_file = os.path.join(self.data_dir, 'cases.json')
        self._ensure_data_file()
    
    def _ensure_data_file(self) -> None:
        """Ensure the cases data file exists, creating it if necessary."""
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
        if not os.path.exists(self.cases_file):
            with open(self.cases_file, 'w') as f:
                json.dump([], f)
    
    def _load_cases(self) -> List[Dict[str, Any]]:
        """Load all cases from the data file."""
        try:
            with open(self.cases_file, 'r') as f:
                return json.load(f)
        except:
            return []
    
    def _save_cases(self, cases: List[Dict[str, Any]]) -> None:
        """Save all cases to the data file."""
        with open(self.cases_file, 'w') as f:
            json.dump(cases, f, indent=2)
    
    def get_all_cases(self) -> List[Dict[str, Any]]:
        """
        Retrieve all cases.
        
        Returns:
            List[Dict[str, Any]]: A list of all cases.
        """
        return self._load_cases()
    
    def get_case_by_id(self, case_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a case by its ID.
        
        Args:
            case_id (str): The ID of the case to retrieve.
            
        Returns:
            Optional[Dict[str, Any]]: The case data or None if not found.
        """
        cases = self._load_cases()
        return next((case for case in cases if case['id'] == case_id), None)
    
    def create_case(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new case.
        
        Args:
            case_data (Dict[str, Any]): The data for the new case.
            
        Returns:
            Dict[str, Any]: The created case, including its assigned ID.
        """
        cases = self._load_cases()
        
        # Generate a unique case ID with timestamp
        timestamp = datetime.now().strftime("%Y%m%d")
        case_id = f"CASE-{timestamp}-{uuid.uuid4().hex[:8]}"
        
        new_case = {
            **case_data,
            'id': case_id,
            'status': CaseStatus.NEW,
            'created': datetime.now().isoformat(),
            'updated': datetime.now().isoformat(),
            'timeline': [],
            'documents': [],
            'next_steps': [],
            'assigned_to': None,
            'priority': case_data.get('priority', CasePriority.MEDIUM),
            'status_history': [{
                'status': CaseStatus.NEW,
                'timestamp': datetime.now().isoformat(),
                'user': case_data.get('created_by'),
                'notes': 'Case created'
            }]
        }
        
        cases.append(new_case)
        self._save_cases(cases)
        return new_case
    
    def update_case(self, case_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Update an existing case.
        
        Args:
            case_id (str): The ID of the case to update.
            update_data (Dict[str, Any]): The data to update.
            
        Returns:
            Optional[Dict[str, Any]]: The updated case or None if not found.
        """
        cases = self._load_cases()
        case_index = next((i for i, case in enumerate(cases) if case['id'] == case_id), -1)
        
        if case_index == -1:
            return None
            
        current_case = cases[case_index]
        
        # Handle status change
        if 'status' in update_data and update_data['status'] != current_case['status']:
            status_change = {
                'status': update_data['status'],
                'timestamp': datetime.now().isoformat(),
                'user': update_data.get('updated_by'),
                'notes': update_data.get('status_notes', '')
            }
            current_case['status_history'].append(status_change)
        
        # Update case data
        updated_case = {
            **current_case,
            **update_data,
            'updated': datetime.now().isoformat()
        }
        
        cases[case_index] = updated_case
        self._save_cases(cases)
        return updated_case
    
    def delete_case(self, case_id: str) -> bool:
        """
        Delete a case.
        
        Args:
            case_id (str): The ID of the case to delete.
            
        Returns:
            bool: True if the case was deleted, False if not found.
        """
        cases = self._load_cases()
        initial_length = len(cases)
        cases = [case for case in cases if case['id'] != case_id]
        
        if len(cases) < initial_length:
            self._save_cases(cases)
            return True
        return False
    
    def add_timeline_event(self, case_id: str, event_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Add a timeline event to a case.
        
        Args:
            case_id (str): The ID of the case.
            event_data (Dict[str, Any]): The event data to add.
            
        Returns:
            Optional[Dict[str, Any]]: The updated case or None if not found.
        """
        cases = self._load_cases()
        
        for i, case in enumerate(cases):
            if case['id'] == case_id:
                if 'timeline' not in case:
                    case['timeline'] = []
                
                event = {
                    **event_data,
                    'id': f"TL-{len(case['timeline']) + 1}",
                    'date': datetime.now().isoformat()
                }
                
                case['timeline'].append(event)
                case['updated'] = datetime.now().isoformat()
                self._save_cases(cases)
                return event
        return None
    
    def add_document(self, case_id: str, document_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Add a document to a case.
        
        Args:
            case_id (str): The ID of the case.
            document_data (Dict[str, Any]): The document data to add.
            
        Returns:
            Optional[Dict[str, Any]]: The updated case or None if not found.
        """
        cases = self._load_cases()
        
        for i, case in enumerate(cases):
            if case['id'] == case_id:
                if 'documents' not in case:
                    case['documents'] = []
                
                document = {
                    **document_data,
                    'id': f"DOC-{len(case['documents']) + 1}",
                    'uploaded': datetime.now().isoformat()
                }
                
                case['documents'].append(document)
                case['updated'] = datetime.now().isoformat()
                self._save_cases(cases)
                return document
        return None
    
    def add_next_step(self, case_id: str, step_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Add a next step to a case.
        
        Args:
            case_id (str): The ID of the case.
            step_data (Dict[str, Any]): The step data to add.
            
        Returns:
            Optional[Dict[str, Any]]: The updated case or None if not found.
        """
        cases = self._load_cases()
        
        for i, case in enumerate(cases):
            if case['id'] == case_id:
                if 'nextSteps' not in case:
                    case['nextSteps'] = []
                
                step = {
                    **step_data,
                    'id': f"NS-{len(case['nextSteps']) + 1}",
                    'created': datetime.now().isoformat(),
                    'completed': False
                }
                
                case['nextSteps'].append(step)
                case['updated'] = datetime.now().isoformat()
                self._save_cases(cases)
                return step
        return None
    
    def update_next_step(self, case_id: str, step_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Update a next step in a case.
        
        Args:
            case_id (str): The ID of the case.
            step_id (str): The ID of the step to update.
            update_data (Dict[str, Any]): The data to update.
            
        Returns:
            Optional[Dict[str, Any]]: The updated case or None if not found.
        """
        cases = self._load_cases()
        
        for case in cases:
            if case['id'] == case_id and 'nextSteps' in case:
                for i, step in enumerate(case['nextSteps']):
                    if step['id'] == step_id:
                        case['nextSteps'][i] = {
                            **step,
                            **update_data,
                            'updated': datetime.now().isoformat()
                        }
                        case['updated'] = datetime.now().isoformat()
                        self._save_cases(cases)
                        return case['nextSteps'][i]
        return None
    
    def assign_case(self, case_id: str, user_id: str, notes: str = "") -> Optional[Dict[str, Any]]:
        cases = self._load_cases()
        case = next((case for case in cases if case['id'] == case_id), None)
        
        if not case:
            return None
            
        case['assigned_to'] = user_id
        case['updated'] = datetime.now().isoformat()
        
        # Add assignment to timeline
        timeline_event = {
            'type': 'assignment',
            'description': f'Case assigned to user {user_id}',
            'notes': notes,
            'timestamp': datetime.now().isoformat()
        }
        case['timeline'].append(timeline_event)
        
        self._save_cases(cases)
        return case

    def update_priority(self, case_id: str, priority: str, notes: str = "") -> Optional[Dict[str, Any]]:
        if priority not in vars(CasePriority).values():
            raise ValueError(f"Invalid priority level. Must be one of: {', '.join(vars(CasePriority).values())}")
            
        cases = self._load_cases()
        case = next((case for case in cases if case['id'] == case_id), None)
        
        if not case:
            return None
            
        case['priority'] = priority
        case['updated'] = datetime.now().isoformat()
        
        # Add priority change to timeline
        timeline_event = {
            'type': 'priority_change',
            'description': f'Priority changed to {priority}',
            'notes': notes,
            'timestamp': datetime.now().isoformat()
        }
        case['timeline'].append(timeline_event)
        
        self._save_cases(cases)
        return case

    def get_case_history(self, case_id: str) -> Optional[List[Dict[str, Any]]]:
        case = self.get_case_by_id(case_id)
        return case['status_history'] if case else None

    def filter_cases(self, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Filter cases based on criteria.
        
        Args:
            filters (Dict[str, Any]): The filter criteria.
            
        Returns:
            List[Dict[str, Any]]: The filtered cases.
        """
        cases = self._load_cases()
        filtered_cases = cases
        
        if 'status' in filters:
            filtered_cases = [c for c in filtered_cases if c['status'] == filters['status']]
        
        if 'priority' in filters:
            filtered_cases = [c for c in filtered_cases if c['priority'] == filters['priority']]
        
        if 'assigned_to' in filters:
            filtered_cases = [c for c in filtered_cases if c['assigned_to'] == filters['assigned_to']]
        
        if 'type' in filters:
            filtered_cases = [c for c in filtered_cases if c['type'] == filters['type']]
        
        if 'client_id' in filters:
            filtered_cases = [c for c in filtered_cases if c.get('client', {}).get('id') == filters['client_id']]
        
        return filtered_cases

# Create singleton instance
case_service = CaseService() 