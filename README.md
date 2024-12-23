# SmartProBono

A comprehensive legal assistance platform that provides pro bono services, document generation, and AI-powered legal guidance.

## Features

- **Document Generation**: Automated creation of legal documents and contracts
- **Legal AI Chat**: AI-powered legal guidance and assistance
- **Immigration Services**: Support for immigration-related legal matters
- **Pro Bono Case Management**: Tools for managing pro bono cases and client information

## Tech Stack

### Backend
- Python 3.x
- Flask
- SQLAlchemy
- OpenAI API integration
- PDF Generation tools

### Frontend
- React.js
- Material-UI (MUI)
- Axios for API communication
- React Router for navigation

## Getting Started

### Prerequisites
- Node.js (v18.x or higher)
- Python 3.x
- pip (Python package manager)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BTheCoderr/smartProBonoAPP.git
cd smartProBonoAPP
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

3. Set up the frontend:
```bash
cd frontend
npm install
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
smartProBonoAPP/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
└── README.md
```

## API Endpoints

- `/api/auth`: Authentication endpoints
- `/api/documents`: Document generation and management
- `/api/legal-ai`: AI-powered legal assistance
- `/api/immigration`: Immigration services

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/BTheCoderr/smartProBonoAPP](https://github.com/BTheCoderr/smartProBonoAPP)
