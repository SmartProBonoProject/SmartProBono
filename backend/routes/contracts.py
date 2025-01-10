from flask import Blueprint, request, jsonify, send_file
from jinja2 import Template
import pdfkit
import os
from datetime import datetime
import tempfile

contracts = Blueprint('contracts', __name__)

# Template definitions with placeholders
TEMPLATES = {
    'Last Will and Testament': '''
        LAST WILL AND TESTAMENT
        
        I, {{fullName}}, residing at {{address}}, being of sound mind, declare this to be my Last Will and Testament.
        
        ARTICLE I - BENEFICIARIES
        {{beneficiaries}}
        
        ARTICLE II - EXECUTOR
        I hereby appoint {{executor}} as executor of my estate.
        
        Date: {{date}}
        Signature: _________________
    ''',
    
    'Power of Attorney': '''
        POWER OF ATTORNEY
        
        I, {{grantor}}, hereby appoint {{attorney}} as my Attorney-in-Fact.
        
        POWERS GRANTED:
        {{powers}}
        
        This Power of Attorney shall become effective on {{effectiveDate}}.
        
        Date: {{date}}
        Signature: _________________
    ''',
    
    'Rental Agreement': '''
        RENTAL AGREEMENT
        
        This agreement is made between {{landlord}} ("Landlord") and {{tenant}} ("Tenant").
        
        PROPERTY:
        {{property}}
        
        TERM:
        {{term}}
        
        RENT:
        {{rent}}
        
        Date: {{date}}
        Signatures:
        Landlord: _________________
        Tenant: _________________
    ''',
    
    'Employment Contract': '''
        EMPLOYMENT CONTRACT
        
        This agreement is made between {{employer}} ("Employer") and {{employee}} ("Employee").
        
        POSITION:
        {{position}}
        
        SALARY:
        {{salary}}
        
        START DATE:
        {{startDate}}
        
        Date: {{date}}
        Signatures:
        Employer: _________________
        Employee: _________________
    ''',
    
    'Non-Disclosure Agreement': '''
        NON-DISCLOSURE AGREEMENT
        
        This agreement is made between {{disclosingParty}} ("Disclosing Party") and {{receivingParty}} ("Receiving Party").
        
        PURPOSE:
        {{purpose}}
        
        DURATION:
        {{duration}}
        
        Date: {{date}}
        Signatures:
        Disclosing Party: _________________
        Receiving Party: _________________
    ''',
    
    'Service Agreement': '''
        SERVICE AGREEMENT
        
        This agreement is made between {{serviceProvider}} ("Provider") and {{client}} ("Client").
        
        SERVICES:
        {{services}}
        
        COMPENSATION:
        {{compensation}}
        
        Date: {{date}}
        Signatures:
        Provider: _________________
        Client: _________________
    '''
}

@contracts.route('/api/contracts/generate', methods=['POST'])
def generate_contract():
    try:
        data = request.json
        template_name = data.get('template')
        form_data = data.get('formData')
        language = data.get('language', 'English')
        
        if not template_name or not form_data:
            return jsonify({'error': 'Missing template name or form data'}), 400
            
        if template_name not in TEMPLATES:
            return jsonify({'error': 'Template not found'}), 404
            
        # Add current date to form data
        form_data['date'] = datetime.now().strftime('%B %d, %Y')
        
        # Generate document from template
        template = Template(TEMPLATES[template_name])
        document_content = template.render(**form_data)
        
        # Create temporary files for HTML and PDF
        with tempfile.NamedTemporaryFile(suffix='.html', delete=False) as html_file:
            html_content = f'''
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; }}
                        h1 {{ color: #1976d2; }}
                    </style>
                </head>
                <body>
                    <pre style="white-space: pre-wrap;">{document_content}</pre>
                </body>
                </html>
            '''
            html_file.write(html_content.encode())
            html_path = html_file.name
            
        pdf_path = html_path.replace('.html', '.pdf')
        
        # Convert HTML to PDF
        pdfkit.from_file(html_path, pdf_path)
        
        # Clean up HTML file
        os.unlink(html_path)
        
        # Send PDF file
        return send_file(
            pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"{template_name.lower().replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.pdf"
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@contracts.route('/api/contracts/templates', methods=['GET'])
def get_templates():
    return jsonify({
        'templates': list(TEMPLATES.keys())
    }) 