# SmartProBono - Open-Source AI-Powered Legal Assistance Platform

SmartProBono is a comprehensive legal assistance platform designed to provide accessible legal resources and support to those in need. The platform leverages AI technology to help users understand their legal rights, generate legal documents, and connect with pro bono legal services.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Discord](https://img.shields.io/discord/1234567890?color=7289DA&label=Discord&logo=discord&logoColor=white)](https://discord.gg/smartprobono)
[![CI](https://github.com/SmartProBono/smartProBonoAPP/actions/workflows/ci.yml/badge.svg)](https://github.com/SmartProBono/smartProBonoAPP/actions/workflows/ci.yml)
[![Deploy](https://github.com/SmartProBono/smartProBonoAPP/actions/workflows/deploy.yml/badge.svg)](https://github.com/SmartProBono/smartProBonoAPP/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/SmartProBono/smartProBonoAPP/branch/main/graph/badge.svg)](https://codecov.io/gh/SmartProBono/smartProBonoAPP)
[![Dependency Review](https://github.com/SmartProBono/smartProBonoAPP/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/SmartProBono/smartProBonoAPP/actions/workflows/dependency-review.yml)

## 🌟 Open Source Community

SmartProBono is an open-source project! We believe in the power of community to make legal assistance more accessible to everyone. By open-sourcing our platform, we aim to:

- Foster innovation in legal tech
- Improve accessibility to legal resources
- Create a collaborative ecosystem of legal professionals, developers, and advocates
- Ensure transparency and trust in our AI-powered legal tools

## 📋 Project Resources

- [Project Roadmap](ROADMAP.md) - Our short, mid, and long-term goals
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project
- [Code of Conduct](CODE_OF_CONDUCT.md) - Our community standards
- [Community Strategy](COMMUNITY.md) - How we're building our community
- [Governance Model](GOVERNANCE.md) - How decisions are made
- [Security Policy](SECURITY.md) - How we handle security issues

## ✨ Features

- 🤖 **AI Legal Assistant**: Get instant answers to legal questions and guidance on legal procedures
- 📄 **Document Generation**: Create legal documents with easy-to-use templates
- 🔍 **Legal Rights Information**: Access comprehensive information about your legal rights
- 🌐 **Multi-language Support**: Available in English and Spanish
- 🎯 **Case Progress Tracking**: Monitor your legal case progress
- 🔒 **Secure Identity Verification**: Protect sensitive information with advanced security measures

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python 3.11 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SmartProBono/smartProBonoAPP.git
cd smartProBonoAPP
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

## 🔐 Security Notice

⚠️ **Important**: Never commit `.env` files to version control. They contain sensitive information like API keys and should be kept private.

## 👥 Contributing to SmartProBono

We welcome contributions from developers, legal professionals, and anyone passionate about improving access to justice! Here's how you can contribute:

### For Developers
- Fix bugs and implement new features
- Improve performance and accessibility
- Add tests and documentation
- Review pull requests

### For Legal Professionals
- Provide legal expertise and review content
- Suggest improvements to legal document templates
- Help validate AI responses for accuracy
- Identify areas where the platform can be more helpful

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 💬 Community

Join our community to get help, share ideas, and collaborate:

- [GitHub Discussions](https://github.com/SmartProBono/smartProBonoAPP/discussions)
- [Discord Server](https://discord.gg/smartprobono)
- [Community Forum](https://forum.smartprobono.org)

## 💖 Support the Project

If you find SmartProBono valuable, please consider supporting the project:

- [GitHub Sponsors](https://github.com/sponsors/SmartProBono)
- [Open Collective](https://opencollective.com/smart-pro-bono)
- [Patreon](https://patreon.com/smartprobono)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all our contributors and pro bono partners
- Special thanks to the legal community for their guidance and support
- Built with the support of open-source tools and libraries
