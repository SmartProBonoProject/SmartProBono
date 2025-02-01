from flask import Blueprint, request, jsonify, send_file
from jinja2 import Template
import pdfkit
import os
from datetime import datetime
import tempfile
import json

contracts = Blueprint('contracts', __name__)

# Template definitions with placeholders and metadata
TEMPLATES = {
    'Last Will and Testament': {
        'template': '''
            <div class="legal-document">
                <h1 class="document-title">LAST WILL AND TESTAMENT</h1>
                
                <p class="preamble">I, {{fullName}}, residing at {{address}}, being of sound mind and memory, do hereby make, publish, and declare this to be my Last Will and Testament, hereby revoking all previous wills and codicils made by me.</p>
                
                <h2>ARTICLE I - PRELIMINARY DECLARATIONS</h2>
                <p>A. I am currently a resident of {{state}}.</p>
                <p>B. Family Status: {{familyStatus}}</p>
                
                <h2>ARTICLE II - DISPOSITION OF PROPERTY</h2>
                {{#each beneficiaries}}
                <p>I give, devise, and bequeath {{this.share}} to {{this.name}}, {{this.relationship}}.</p>
                {{/each}}
                
                <h2>ARTICLE III - EXECUTOR</h2>
                <p>I hereby nominate and appoint {{executor.name}}, residing at {{executor.address}}, as Executor of this Will. If {{executor.name}} is unable or unwilling to serve, I appoint {{alternateExecutor.name}} as alternate Executor.</p>
                
                <div class="signature-section">
                    <p>IN WITNESS WHEREOF, I have hereunto set my hand this {{date}}.</p>
                    <div class="signature-line">
                        <p>____________________________</p>
                        <p>{{fullName}} (Testator)</p>
                    </div>
                </div>
                
                <div class="witness-section">
                    <h3>WITNESSES</h3>
                    <p>This Will was signed, published, and declared by {{fullName}}, as their Last Will and Testament, in our presence, and we, at their request and in their presence, and in the presence of each other, have subscribed our names as witnesses.</p>
                    <div class="witness-signatures">
                        <div class="signature-line">
                            <p>____________________________</p>
                            <p>Witness 1 Signature</p>
                        </div>
                        <div class="signature-line">
                            <p>____________________________</p>
                            <p>Witness 2 Signature</p>
                        </div>
                    </div>
                </div>
            </div>
        ''',
        'required_fields': ['fullName', 'address', 'state', 'familyStatus', 'beneficiaries', 'executor'],
        'optional_fields': ['alternateExecutor'],
        'validation_rules': {
            'fullName': r'^[A-Za-z\s\-\'\.]+$',
            'state': r'^[A-Za-z\s]+$',
            'beneficiaries': {
                'min_length': 1,
                'fields': ['name', 'relationship', 'share']
            }
        }
    },
    
    'Power of Attorney': {
        'template': '''
            <div class="legal-document">
                <h1 class="document-title">DURABLE POWER OF ATTORNEY</h1>
                
                <p class="preamble">This Durable Power of Attorney is made on {{date}} by {{grantor}} ("Principal"), residing at {{grantorAddress}}.</p>
                
                <h2>1. APPOINTMENT OF AGENT</h2>
                <p>I hereby appoint {{attorney.name}}, residing at {{attorney.address}} ("Agent"), to act as my Attorney-in-Fact.</p>
                
                <h2>2. POWERS GRANTED</h2>
                <div class="powers-section">
                    {{#each powers}}
                    <p>☐ {{this.description}}</p>
                    {{/each}}
                </div>
                
                <h2>3. DURABILITY</h2>
                <p>This Power of Attorney shall not be affected by my subsequent disability or incapacity.</p>
                
                <h2>4. EFFECTIVE DATE</h2>
                <p>This Power of Attorney shall become effective on {{effectiveDate}}.</p>
                
                <h2>5. TERMINATION</h2>
                <p>This Power of Attorney shall terminate upon my death or by my revocation in writing.</p>
                
                <div class="signature-section">
                    <p>IN WITNESS WHEREOF, I have hereunto set my hand on {{date}}.</p>
                    <div class="signature-line">
                        <p>____________________________</p>
                        <p>{{grantor}} (Principal)</p>
                    </div>
                </div>
                
                <div class="notary-section">
                    <h3>NOTARY ACKNOWLEDGMENT</h3>
                    <p>State of ________________</p>
                    <p>County of ________________</p>
                    <p>On {{date}}, before me personally appeared {{grantor}}, proved to me through satisfactory evidence of identification to be the person whose name is signed above.</p>
                    <div class="signature-line">
                        <p>____________________________</p>
                        <p>Notary Public</p>
                        <p>My Commission Expires: ________________</p>
                    </div>
                </div>
            </div>
        ''',
        'required_fields': ['grantor', 'grantorAddress', 'attorney', 'powers', 'effectiveDate'],
        'validation_rules': {
            'powers': {
                'min_length': 1,
                'fields': ['description']
            }
        }
    },
    
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
    
    'Employment Contract': {
        'template': '''
            <div class="legal-document">
                <h1 class="document-title">EMPLOYMENT AGREEMENT</h1>
                
                <p class="preamble">This Employment Agreement (the "Agreement") is made and entered into on {{date}} by and between:</p>
                
                <p><strong>{{employer.name}}</strong>, a company organized under the laws of {{employer.state}}, having its principal place of business at {{employer.address}} (the "Employer")</p>
                
                <p>and</p>
                
                <p><strong>{{employee.name}}</strong>, residing at {{employee.address}} (the "Employee").</p>
                
                <h2>1. POSITION AND DUTIES</h2>
                <p>1.1. Position: The Employee shall be employed as {{position.title}} and shall perform the duties described in Schedule A attached hereto.</p>
                <p>1.2. Reporting: The Employee shall report to {{position.reportsTo}}.</p>
                
                <h2>2. TERM AND TERMINATION</h2>
                <p>2.1. Commencement: This Agreement shall commence on {{startDate}}.</p>
                <p>2.2. Term: {{#if isFixedTerm}}This Agreement shall continue for a fixed term of {{term}} months.{{else}}This Agreement shall continue indefinitely until terminated in accordance with this Agreement.{{/if}}</p>
                
                <h2>3. COMPENSATION</h2>
                <p>3.1. Base Salary: The Employee shall receive a base salary of {{compensation.baseSalary}} per {{compensation.paymentInterval}}.</p>
                {{#if compensation.bonus}}
                <p>3.2. Bonus: {{compensation.bonus}}</p>
                {{/if}}
                
                <h2>4. BENEFITS</h2>
                <div class="benefits-section">
                    {{#each benefits}}
                    <p>• {{this}}</p>
                    {{/each}}
                </div>
                
                <h2>5. WORKING HOURS AND LOCATION</h2>
                <p>5.1. Hours: {{workSchedule.hours}}</p>
                <p>5.2. Location: {{workSchedule.location}}</p>
                
                <h2>6. CONFIDENTIALITY</h2>
                <p>The Employee agrees to maintain the confidentiality of the Employer's proprietary information and trade secrets during and after employment.</p>
                
                <h2>7. INTELLECTUAL PROPERTY</h2>
                <p>All work product developed by the Employee during the course of employment shall be the exclusive property of the Employer.</p>
                
                <h2>8. NON-COMPETE</h2>
                <p>{{nonCompete}}</p>
                
                <div class="signature-section">
                    <p>IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.</p>
                    
                    <div class="signatures">
                        <div class="signature-block">
                            <p class="signature-line">____________________________</p>
                            <p>For and on behalf of {{employer.name}}</p>
                            <p>Name: {{employer.signatoryName}}</p>
                            <p>Title: {{employer.signatoryTitle}}</p>
                            <p>Date: {{date}}</p>
                        </div>
                        
                        <div class="signature-block">
                            <p class="signature-line">____________________________</p>
                            <p>{{employee.name}}</p>
                            <p>Employee</p>
                            <p>Date: {{date}}</p>
                        </div>
                    </div>
                </div>
                
                <div class="schedule-section">
                    <h2>SCHEDULE A - JOB DUTIES</h2>
                    <div class="duties-section">
                        {{#each position.duties}}
                        <p>• {{this}}</p>
                        {{/each}}
                    </div>
                </div>
            </div>
        ''',
        'required_fields': [
            'employer.name', 'employer.state', 'employer.address', 
            'employee.name', 'employee.address',
            'position.title', 'position.reportsTo', 'position.duties',
            'startDate', 'compensation.baseSalary', 'compensation.paymentInterval',
            'workSchedule.hours', 'workSchedule.location'
        ],
        'optional_fields': [
            'isFixedTerm', 'term', 'compensation.bonus', 'benefits',
            'nonCompete', 'employer.signatoryName', 'employer.signatoryTitle'
        ],
        'validation_rules': {
            'employer.name': r'^[A-Za-z0-9\s\-\.,&]+$',
            'employee.name': r'^[A-Za-z\s\-\'\.]+$',
            'compensation.baseSalary': r'^\$?\d+(?:,\d{3})*(?:\.\d{2})?$',
            'position.duties': {
                'min_length': 1
            }
        }
    },
    
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

# CSS styles for PDF documents
PDF_STYLES = '''
    <style>
        .legal-document {
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.6;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .document-title {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
        }
        
        h2 {
            font-size: 18px;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        
        .preamble {
            text-align: justify;
            margin-bottom: 25px;
        }
        
        .signature-section {
            margin-top: 50px;
        }
        
        .signature-line {
            margin-top: 30px;
            border-top: 1px solid #000;
            width: 250px;
            text-align: center;
        }
        
        .witness-section, .notary-section {
            margin-top: 40px;
            page-break-inside: avoid;
        }
        
        .witness-signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
        }
        
        .powers-section {
            margin-left: 20px;
        }
    </style>
'''

def validate_form_data(template_name, form_data):
    """Validate form data against template requirements."""
    template_info = TEMPLATES[template_name]
    
    # Check required fields
    for field in template_info['required_fields']:
        if field not in form_data:
            return False, f"Missing required field: {field}"
    
    # Validate field formats
    if 'validation_rules' in template_info:
        import re
        for field, rule in template_info['validation_rules'].items():
            if isinstance(rule, str):  # Regex validation
                if field in form_data and not re.match(rule, str(form_data[field])):
                    return False, f"Invalid format for field: {field}"
            elif isinstance(rule, dict):  # Complex validation
                if 'min_length' in rule and len(form_data.get(field, [])) < rule['min_length']:
                    return False, f"Field {field} requires at least {rule['min_length']} items"
                if 'fields' in rule:
                    for item in form_data.get(field, []):
                        for required_field in rule['fields']:
                            if required_field not in item:
                                return False, f"Missing required subfield {required_field} in {field}"
    
    return True, None

@contracts.route('/api/contracts/generate', methods=['POST'])
def generate_contract():
    try:
        data = request.json
        template_name = data.get('template')
        form_data = data.get('formData')
        
        if not template_name or not form_data:
            return jsonify({'error': 'Missing template name or form data'}), 400
            
        if template_name not in TEMPLATES:
            return jsonify({'error': 'Template not found'}), 404
        
        # Validate form data
        is_valid, error_message = validate_form_data(template_name, form_data)
        if not is_valid:
            return jsonify({'error': error_message}), 400
            
        # Add current date to form data
        form_data['date'] = datetime.now().strftime('%B %d, %Y')
        
        # Generate document from template
        template = Template(TEMPLATES[template_name]['template'])
        document_content = template.render(**form_data)
        
        # Create temporary files for HTML and PDF
        with tempfile.NamedTemporaryFile(suffix='.html', delete=False) as html_file:
            html_content = f'''
                <html>
                <head>
                    {PDF_STYLES}
                </head>
                <body>
                    {document_content}
                </body>
                </html>
            '''
            html_file.write(html_content.encode())
            html_path = html_file.name
            
        pdf_path = html_path.replace('.html', '.pdf')
        
        # Convert HTML to PDF with improved options
        options = {
            'page-size': 'Letter',
            'margin-top': '0.75in',
            'margin-right': '0.75in',
            'margin-bottom': '0.75in',
            'margin-left': '0.75in',
            'encoding': 'UTF-8',
            'no-outline': None,
            'enable-local-file-access': None
        }
        
        pdfkit.from_file(html_path, pdf_path, options=options)
        
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
    """Get available templates with their metadata."""
    templates_info = {}
    for name, info in TEMPLATES.items():
        templates_info[name] = {
            'required_fields': info['required_fields'],
            'optional_fields': info.get('optional_fields', []),
            'validation_rules': info.get('validation_rules', {})
        }
    return jsonify({'templates': templates_info}) 