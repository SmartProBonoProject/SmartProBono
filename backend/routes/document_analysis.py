from flask import Blueprint, request, jsonify
import os
import json
from ai.document_analyzer import DocumentAnalyzer

# Create the document analysis blueprint
bp = Blueprint('document_analysis', __name__, url_prefix='/api/document-analysis', cli_group=None)

# Initialize the document analyzer
analyzer = DocumentAnalyzer()

@bp.route('/analyze', methods=['POST'])
def analyze_document():
    """
    Analyze a document using AI.
    
    Request body should contain:
    - document_text: The text content of the document to analyze
    - document_type: (Optional) The type of document to guide analysis
    
    Returns:
        JSON response with analysis results
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    
    if 'document_text' not in data or not data['document_text']:
        return jsonify({"error": "Document text is required"}), 400
    
    document_text = data['document_text']
    document_type = data.get('document_type')  # Optional
    
    try:
        # Analyze the document
        result = analyzer.analyze_document(document_text, document_type)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/supported-types', methods=['GET'])
def get_supported_document_types():
    """
    Get a list of document types supported by the analyzer.
    
    Returns:
        JSON response with supported document types and their descriptions
    """
    supported_types = {
        "contract": "Legal agreements between parties",
        "legal_brief": "Documents filed with courts presenting legal arguments",
        "immigration_form": "Forms related to immigration applications",
        "unknown": "Any other document type (generic analysis)"
    }
    
    return jsonify({
        "supported_types": supported_types,
        "default": "unknown"
    })

@bp.route('/sample', methods=['GET'])
def get_sample_analysis():
    """
    Get a sample document analysis result.
    
    Query parameters:
    - type: The type of document sample to return (contract, legal_brief, immigration_form)
    
    Returns:
        JSON response with a sample analysis
    """
    document_type = request.args.get('type', 'contract')
    
    # Sample contract text
    if document_type == 'contract':
        sample_text = """
        AGREEMENT
        
        This Agreement is made on April 15, 2023, between ABC Corporation, a Delaware corporation ("Company"), and John Smith, an individual ("Consultant").
        
        1. SERVICES
        Consultant shall provide marketing consulting services to Company as described in Exhibit A.
        
        2. TERM
        This Agreement shall commence on April 20, 2023 and continue until October 20, 2023, unless terminated earlier.
        
        3. COMPENSATION
        Company shall pay Consultant $5,000 per month for services rendered.
        
        4. CONFIDENTIALITY
        Consultant shall maintain all confidential information in strict confidence.
        
        5. INDEMNIFICATION
        Consultant shall indemnify and hold Company harmless from any claims arising from Consultant's performance.
        
        6. TERMINATION
        Either party may terminate this Agreement with 30 days written notice.
        
        IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.
        
        ABC Corporation
        By: Jane Doe, CEO
        
        John Smith
        """
    elif document_type == 'legal_brief':
        sample_text = """
        IN THE UNITED STATES DISTRICT COURT
        FOR THE NORTHERN DISTRICT OF CALIFORNIA
        
        Case No. CV-2023-12345
        
        JOHN DOE,
        Plaintiff,
        
        v.
        
        ACME CORPORATION,
        Defendant.
        
        PLAINTIFF'S MOTION FOR SUMMARY JUDGMENT
        
        INTRODUCTION
        
        Plaintiff John Doe respectfully moves this Court for summary judgment pursuant to Rule 56 of the Federal Rules of Civil Procedure.
        
        STATEMENT OF FACTS
        
        On January 15, 2023, Plaintiff was injured while using Defendant's product...
        
        ARGUMENT
        
        I. DEFENDANT BREACHED ITS DUTY OF CARE
        
        Defendant had a duty to design and manufacture safe products. As established in Smith v. Jones, 123 U.S. 456 (2019), manufacturers must...
        
        II. PLAINTIFF IS ENTITLED TO DAMAGES
        
        Under California law, Plaintiff is entitled to compensatory damages...
        
        CONCLUSION
        
        For the foregoing reasons, Plaintiff respectfully requests that this Court grant summary judgment in his favor.
        
        Respectfully submitted,
        
        Jane Smith
        Attorney for Plaintiff
        """
    else:  # immigration form
        sample_text = """
        FORM I-589
        APPLICATION FOR ASYLUM AND WITHHOLDING OF REMOVAL
        
        Full Name: Maria Garcia
        Date of Birth: 05/12/1985
        Nationality: Honduras
        Passport Number: H12345678
        Visa Type: B-2
        
        Travel History:
        01/15/2023 to 01/20/2023 Mexico
        01/21/2023 to Present United States
        
        Purpose of Application:
        Applicant seeks asylum based on political persecution in home country...
        
        Supporting Documents:
        • Passport
        • Birth Certificate
        • Police Reports
        • Witness Statements
        • Medical Records
        
        Declaration:
        I, Maria Garcia, declare under penalty of perjury that the foregoing is true and correct...
        """
    
    # Analyze the sample document
    result = analyzer.analyze_document(sample_text, document_type)
    
    return jsonify({
        "sample_type": document_type,
        "sample_text": sample_text[:200] + "...",  # First 200 chars for preview
        "analysis_result": result
    })
