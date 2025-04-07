# Smart Pro Bono App

A comprehensive platform designed to connect legal professionals with individuals in need of pro bono legal assistance. This application streamlines the process of matching attorneys with clients, managing cases, scheduling appointments, and providing legal resources.

## Features

### Core Functionality

- **User Authentication**: Secure login and registration for attorneys, clients, and administrators
- **Case Management**: Track and manage pro bono cases with status updates and document sharing
- **Appointment Scheduling**: Book and manage appointments between attorneys and clients
- **Document Management**: Upload, share, and organize legal documents
- **Real-time Chat**: Communicate securely with clients and other professionals
- **Legal AI Assistant**: Get automated responses to common legal questions

### Advanced Features

- **Real-time Notifications**: Keep users informed of important updates via in-app and browser notifications
- **User Presence System**: See when users are online, offline, or typing
- **Multi-language Support**: Accessibility for users with different language preferences
- **Dark Mode**: Enhanced visual experience with theme customization
- **Accessibility Options**: Features to make the application usable for everyone
- **Rate Limiting**: Protection against abuse of real-time messaging features

## Technology Stack

### Frontend

- **React.js**: Modern, component-based UI library
- **Material-UI**: Component library for consistent, responsive design
- **Socket.IO Client**: Real-time bidirectional event-based communication
- **Context API**: State management throughout the application
- **React Router**: Navigation and routing

### Backend

- **Flask**: Lightweight Python web framework
- **Flask-SocketIO**: WebSocket server for real-time features
- **Flask-JWT-Extended**: Authentication with JSON Web Tokens
- **SQLAlchemy**: SQL toolkit and ORM for database interactions
- **SQLite**: Lightweight disk-based database (development)
- **PostgreSQL**: Production-ready relational database (production)

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/smartprobono.git
   cd smartprobono
   ```

2. Set up the backend
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   flask db upgrade
   ```

3. Set up the frontend
   ```bash
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   FLASK_APP=app.py
   FLASK_ENV=development
   DATABASE_URL=sqlite:///app.db
   SECRET_KEY=your-secret-key
   JWT_SECRET_KEY=your-jwt-secret-key
   ```

### Running the Application

1. Start the backend server
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   flask run
   ```

2. Start the frontend development server
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
smartprobono/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration settings
│   ├── models/                # Database models
│   ├── routes/                # API endpoints
│   ├── services/              # Business logic services
│   ├── utils/                 # Utility functions
│   └── migrations/            # Database migration scripts
├── frontend/
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── contexts/          # React Context providers
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service functions
│   │   ├── utils/             # Utility functions
│   │   ├── App.js             # Main App component
│   │   └── index.js           # Entry point
│   └── package.json           # Dependencies and scripts
└── docs/                      # Documentation files
```

## Key Features Documentation

- [Authentication System](docs/authentication.md)
- [Notification System](docs/notifications.md)
- [Real-time Chat](docs/chat.md)
- [Legal AI Assistant](docs/legal-ai.md)
- [Case Management](docs/case-management.md)

## Deployment

### Docker Deployment

```bash
docker-compose up -d
```

### Manual Deployment

1. Build the frontend
   ```bash
   cd frontend
   npm run build
   ```

2. Set up a production database (PostgreSQL recommended)

3. Configure environment variables for production

4. Serve the frontend using a static file server (Nginx, Apache)

5. Run the backend using a production WSGI server (Gunicorn)
   ```bash
   gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 app:app
   ```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- All the open-source libraries and frameworks that made this project possible
- The legal professionals who provided domain expertise
- YCombinator for their support and guidance
