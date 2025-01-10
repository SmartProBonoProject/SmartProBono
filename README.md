# SmartProBono - Free Legal Services Platform

SmartProBono is a modern, user-friendly platform designed to make legal assistance accessible to everyone. Our AI-powered platform provides free legal guidance, document generation, and professional resources to those who need it most.

## Features

### 🤖 AI-Powered Legal Chat
- 24/7 instant legal assistance
- Personalized guidance and recommendations
- Clear explanations of legal concepts
- Step-by-step process navigation

### 📄 Document Services
- Free legal document generation
- Contract review and analysis
- Document templates and forms
- Multi-language support

### ⚖️ Legal Rights Information
- Comprehensive rights education
- Interactive guidance
- Up-to-date legal information
- Easy-to-understand explanations

### 🌐 Immigration Support
- Visa application assistance
- Immigration process guidance
- Document preparation help
- Multi-language resources

### 💼 Pro Bono Services
- Connection to legal professionals
- Free consultation matching
- Resource directory
- Community support

## Technology Stack

### Frontend
- React.js 18
- Material-UI (MUI) v5
- React Router v6
- Modern responsive design
- Progressive Web App capabilities

### Backend
- Python Flask
- OpenAI GPT Integration
- RESTful API
- Secure document handling

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smart-pro-bono.git
cd smart-pro-bono
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

4. Set up environment variables:
Create `.env` file in the backend directory:
```env
OPENAI_API_KEY=your_api_key
FLASK_ENV=development
PORT=5000
```

### Running Locally

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

Visit `http://localhost:3000` to view the application.

## Deployment

The frontend is deployed on GitHub Pages and can be accessed at: [SmartProBono App](https://bthecoderr.github.io/pro-bono-app/)

To deploy your own instance:

1. Update the `homepage` in `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/your-repo-name"
}
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions, support, or collaboration opportunities, please reach out through our [contact form](https://bthecoderr.github.io/pro-bono-app/contact).

## Acknowledgments

- OpenAI for powering our AI capabilities
- Material-UI team for the excellent component library
- All contributors and supporters making legal aid more accessible
