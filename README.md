# Task Management System

A full-featured Task Management System built with React (TypeScript) and Django REST Framework. This application provides a modern, responsive interface for managing tasks, comments, and activity tracking.

## Features

- 🔐 User Authentication (JWT)
- 📝 Task Management (Create, Read, Update, Delete)
- 🏷️ Task Categorization (Status, Priority, Tags)
- 💬 Comment System
- 📊 Activity Logging
- 👥 User Assignment
- 📱 Responsive Design

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Axios for API calls
- CSS Modules for styling

### Backend
- Django REST Framework
- Django Simple History for activity tracking
- JWT Authentication
- SQLite Database (can be easily switched to PostgreSQL)

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd taskmanager/backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser (optional):
```bash
python manage.py createsuperuser
```

6. Start the development server:
```bash
python manage.py runserver
```

The backend server will run on http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd taskmanager/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend application will run on http://localhost:3000

## API Endpoints

### Authentication
- POST `/api/token/` - Get JWT tokens
- POST `/api/token/refresh/` - Refresh JWT token
- POST `/api/users/` - Register new user

### Tasks
- GET `/api/tasks/` - List all tasks
- POST `/api/tasks/` - Create new task
- GET `/api/tasks/{id}/` - Get task details
- PATCH `/api/tasks/{id}/` - Update task
- DELETE `/api/tasks/{id}/` - Delete task
- POST `/api/tasks/{id}/add_comment/` - Add comment to task
- GET `/api/tasks/{id}/activity_logs/` - Get task activity logs

## Project Structure

```
taskmanager/
├── backend/
│   ├── tasks/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── users/
│   │   ├── models.py
│   │   └── views.py
│   └── manage.py
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── services/
    │   └── types/
    └── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Django REST Framework for the robust backend framework
- React for the powerful frontend library
- Django Simple History for activity tracking 