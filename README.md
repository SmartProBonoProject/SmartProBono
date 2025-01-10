# SmartProBono - Free Legal Aid Platform

SmartProBono is a comprehensive legal assistance platform designed to help people access free legal services, guidance, and resources. Our mission is to make legal help accessible to everyone, especially those who cannot afford traditional legal services.

## Our Mission
To bridge the justice gap by providing free, accessible legal assistance and resources to underserved communities. We believe everyone deserves access to quality legal help, regardless of their financial situation.

## Core Services

### 1. Legal AI Assistant
- Interactive chat interface for immediate legal guidance
- Helps understand legal rights and procedures
- Answers common legal questions
- Provides step-by-step guidance for legal processes

### 2. Document Services
- Access to essential legal documents and forms
- Assistance with document completion
- Multi-language support for better accessibility
- Free document review and guidance

### 3. Immigration Support
- Guidance on immigration procedures
- Access to immigration forms
- Information about immigration rights
- Multi-language resources

### 4. Legal Rights Education
- Comprehensive information about legal rights
- Educational resources and guides
- Step-by-step procedures
- Access to legal terminology and explanations

### 5. Resource Center
- Free legal forms and templates
- Court procedure guides
- Legal rights information
- Community legal resources

## Technology Features

### User-Friendly Interface
- Clean, intuitive design
- Mobile-responsive layout
- Multi-language support
- Accessible on all devices

### AI-Powered Assistance
- Real-time legal guidance
- Document explanation
- Rights clarification
- Procedure navigation

### Secure Document Handling
- Safe document generation
- Private information protection
- Secure form submission
- Confidential communication

## Technical Stack

### Frontend
- React.js
- Material-UI (MUI)
- React Router
- Modern responsive design

### Backend
- Python Flask
- OpenAI Integration
- PDF Generation
- RESTful API

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BTheCoderr/smartProBonoAPP.git
cd smartProBonoAPP
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

4. Set up environment variables:
Create `.env` file in the backend directory with:
```
OPENAI_API_KEY=your_api_key
PORT=5001
```

### Running the Application

1. Start the backend server:
```bash
cd backend
python app.py
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Future Enhancements
- Enhanced AI capabilities for more complex legal guidance
- Additional language support
- Expanded document library
- Community legal resource directory
- Integration with pro bono legal services

## Contributing
We welcome contributions that help make legal aid more accessible! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For support, partnership inquiries, or to get involved in making legal aid more accessible, please contact us through the application's contact form.

## Acknowledgments
- OpenAI for AI capabilities
- Material-UI for the component library
- All contributors and supporters helping to make legal aid accessible to everyone
