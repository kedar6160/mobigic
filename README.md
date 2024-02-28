# File Management System

This project provides a simple file management system where users can register, login, upload files, view their uploaded files, delete files, and download files securely.

## Features

- User registration with username and password
- User login
- File upload with unique 6-digit code generation
- File storage on the file system
- View list of uploaded files
- Delete uploaded files
- Secure file downloading using a 6-digit code

## Technologies Used

- Backend: Node.js 
- Frontend: React.js
- Database: MongoDB 
- File Storage: File system

## API Endpoints
- POST /api/users/register: Register a new user.
- POST /api/users/login: Login with username and password.
- POST /api/files/upload: Upload a file.
- GET /api/files/list: Get list of uploaded files.
- DELETE /api/files/:id: Delete an uploaded file.
- GET /api/files/:code: Download a file by providing the correct 6-digit code.
