# SmartProBono - AI-Powered Legal Assistance Platform

SmartProBono is a comprehensive legal assistance platform designed to provide accessible legal resources and support to those in need. The platform leverages AI technology to help users understand their legal rights, generate legal documents, and connect with pro bono legal services.

## Features

- 🤖 **AI Legal Assistant**: Get instant answers to legal questions and guidance on legal procedures
- 📄 **Document Generation**: Create legal documents with easy-to-use templates
- 🔍 **Legal Rights Information**: Access comprehensive information about your legal rights
- 🌐 **Multi-language Support**: Available in English and Spanish
- 🎯 **Case Progress Tracking**: Monitor your legal case progress
- 🔒 **Secure Identity Verification**: Protect sensitive information with advanced security measures

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python 3.11 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pro-bono-app.git
cd pro-bono-app
```

2. Install dependencies:
```bash
npm run install-all
```

This will:
- Install frontend dependencies
- Create a Python virtual environment
- Install backend dependencies

3. Set up environment variables:

Create `.env` files in both frontend and backend directories:

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5001
REACT_APP_WS_URL=http://localhost:3001
REACT_APP_ENV=development
```

Backend (.env):
```
OPENAI_API_KEY=your_api_key_here
```

### Running the Application

Start both frontend and backend servers:
```bash
npm start
```

- Frontend will run on: http://localhost:3000
- Backend will run on: http://localhost:5001

## Security Notice

⚠️ **Important**: Never commit `.env` files to version control. They contain sensitive information like API keys and should be kept private.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

Need help? Contact us at support@smartprobono.org

## Acknowledgments

- Thanks to all our contributors and pro bono partners
- Special thanks to the legal community for their guidance and support
