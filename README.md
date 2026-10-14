 # Connect — Real-Time Chat Frontend

## Project Overview

Connect is a responsive real-time chat application frontend built using React and Vite. It allows registered users to sign in, find other users, open conversations, and exchange messages instantly.

## Technologies Used

- React
- Vite
- JavaScript
- React Router DOM
- Socket.IO Client
- Lucide React
- CSS

## Features

- User registration and login
- JWT-based authentication
- Search registered users
- Create and open conversations
- Send and receive messages in real time
- View previous messages
- Responsive chat interface
- Logout functionality

## Requirements

- Node.js and npm
- The Project 3 backend running on port 5002

## Installation

Open a terminal in the `frontend` directory and run:

```bash
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

http://localhost:5173

## Backend Connection

The frontend communicates with the backend REST API at:

`http://localhost:5002/api`

Socket.IO connects to:

`http://localhost:5002`

Make sure the backend and MongoDB connection are running before testing the application.

## Main Pages

- `/register` — Create an account
- `/login` — Sign in
- `/chat` — Find users and exchange messages

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Chat.jsx
│   ├── utils/
│   │   └── socket.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── package.json
└── README.md
```

## Developer Notes

This frontend is part of the QSkill Full Stack Development internship project. The backend handles authentication, conversations, and message storage, while Socket.IO provides real-time message delivery.