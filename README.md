````markdown
# 📦 Storage Management System

A comprehensive Node.js-based cloud storage management system with email authentication, file management, folder organization, and secure file storage capabilities.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Usage Examples](#-usage-examples)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **🔐 Authentication System**

  - Email & password registration with verification
  - Google OAuth 2.0 integration
  - JWT-based authentication
  - Password reset functionality

- **👤 User Management**

  - User profile management
  - Avatar support
  - Account deletion
  - Password change functionality

- **📁 Folder Management**

  - Create, update, and delete folders
  - Nested folder support
  - Secret folders with PIN protection

- **📄 File Management**

  - Upload multiple file types (images, PDFs, documents)
  - 15GB storage per user
  - File organization by folders
  - Favorite files feature
  - Secret files with PIN protection
  - File download functionality

- **📊 Storage Analytics**

  - Real-time storage usage tracking
  - File statistics by type
  - Calendar view for uploaded files
  - Folder size calculation

- **🔒 Security Features**
  - PIN-protected secret files and folders
  - Secure file storage
  - Input validation
  - Rate limiting ready

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT, Passport.js
- **File Upload:** Multer
- **Email Service:** Nodemailer
- **Security:** Bcrypt.js for password hashing
- **Environment:** Dotenv for configuration

## 📚 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v6.0 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/storage-management-system.git
   cd storage-management-system
   ```
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create uploads directory**

   ```bash
   mkdir uploads
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration (see [Configuration](#-configuration))

5. **Start MongoDB**

   ```bash
   # For Windows
   net start MongoDB

   # For macOS/Linux
   sudo systemctl start mongod
   ```

6. **Run the application**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/storage_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters
JWT_EXPIRE=7d

# Storage Configuration (15GB in bytes)
STORAGE_LIMIT=16106127360

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL (for OAuth redirect)
FRONTEND_URL=http://localhost:3000
```

### 📧 Email Configuration (Gmail)

1. Enable 2-Factor Authentication in your Google account
2. Generate an App Password:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a new app password
   - Use this password in `EMAIL_PASS`

### 🔑 Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

## 📖 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint                | Description              | Auth Required |
| ------ | ----------------------- | ------------------------ | ------------- |
| POST   | `/auth/register`        | Register new user        | No            |
| POST   | `/auth/verify-email`    | Verify email with code   | No            |
| POST   | `/auth/login`           | Login user               | No            |
| POST   | `/auth/forgot-password` | Request password reset   | No            |
| POST   | `/auth/reset-password`  | Reset password with code | No            |
| GET    | `/auth/google`          | Google OAuth login       | No            |
| GET    | `/auth/google/callback` | Google OAuth callback    | No            |

### User Management Endpoints

| Method | Endpoint                | Description      | Auth Required |
| ------ | ----------------------- | ---------------- | ------------- |
| GET    | `/user/profile`         | Get user profile | Yes           |
| PUT    | `/user/profile`         | Update profile   | Yes           |
| PUT    | `/user/change-password` | Change password  | Yes           |
| PUT    | `/user/set-pin`         | Set secret PIN   | Yes           |
| DELETE | `/user/delete-account`  | Delete account   | Yes           |

### Folder Management Endpoints

| Method | Endpoint          | Description              | Auth Required |
| ------ | ----------------- | ------------------------ | ------------- |
| POST   | `/folders`        | Create folder            | Yes           |
| GET    | `/folders`        | Get all folders          | Yes           |
| POST   | `/folders/secret` | Get secret folders (PIN) | Yes           |
| PUT    | `/folders/:id`    | Update folder            | Yes           |
| DELETE | `/folders/:id`    | Delete folder            | Yes           |

### File Management Endpoints

| Method | Endpoint              | Description            | Auth Required |
| ------ | --------------------- | ---------------------- | ------------- |
| POST   | `/files/upload`       | Upload file            | Yes           |
| GET    | `/files`              | Get all files          | Yes           |
| POST   | `/files/secret`       | Get secret files (PIN) | Yes           |
| GET    | `/files/calendar`     | Get files by date      | Yes           |
| PATCH  | `/files/:id/favorite` | Toggle favorite        | Yes           |
| GET    | `/files/download/:id` | Download file          | Yes           |
| DELETE | `/files/:id`          | Delete file            | Yes           |

### Storage Analytics Endpoints

| Method | Endpoint            | Description            | Auth Required |
| ------ | ------------------- | ---------------------- | ------------- |
| GET    | `/storage/stats`    | Get storage statistics | Yes           |
| GET    | `/storage/calendar` | Get calendar data      | Yes           |

### 📄 Detailed API Documentation

Import `Storage-Management-API.postman_collection.json` into Postman for complete API documentation with examples.

## 📁 Project Structure

```
storage-management-system/
├── src/
│   ├── config/
│   │   ├── db.js              # Database configuration
│   │   └── passport.js         # Passport configuration
│   ├── middlewares/
│   │   ├── auth.middleware.js  # Authentication middleware
│   │   └── upload.middleware.js # File upload configuration
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.model.js   # User model
│   │   │   └── auth.routes.js  # Auth routes
│   │   ├── user/
│   │   │   └── user.routes.js  # User routes
│   │   ├── folder/
│   │   │   ├── folder.model.js # Folder model
│   │   │   └── folder.routes.js # Folder routes
│   │   ├── file/
│   │   │   ├── file.model.js   # File model
│   │   │   └── file.routes.js  # File routes
│   │   └── storage/
│   │       └── storage.routes.js # Storage routes
│   └── utils/
│       └── email.js            # Email utility
├── uploads/                    # File storage directory
├── .env                        # Environment variables
├── .env.example               # Environment variables example
├── .gitignore                 # Git ignore file
├── server.js                  # Application entry point
├── package.json               # Dependencies
└── README.md                  # Documentation
```

## 💡 Usage Examples

### Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

### Upload a File

```bash
curl -X POST http://localhost:5000/api/files/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/file.pdf" \
  -F "folder=FOLDER_ID" \
  -F "isSecret=false"
```

### Create a Folder

```bash
curl -X POST http://localhost:5000/api/folders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Documents",
    "isSecret": false
  }'
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Manual Testing

1. Import `Storage-Management-API.postman_collection.json` into Postman
2. Set up environment variables in Postman
3. Run the collection

### Test Files

Create test files for upload testing:

```bash
# Create a test text file
echo "Test content" > test.txt

# Create a test JSON file
echo '{"test": "data"}' > test.json
```

## 🚀 Deployment

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Configure production MongoDB
- [ ] Set up proper email service
- [ ] Enable CORS for your frontend domain
- [ ] Set up file storage (AWS S3 recommended)
- [ ] Configure rate limiting
- [ ] Set up logging service
- [ ] Enable HTTPS

### Deploy to Heroku

```bash
# Create Heroku app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_secret

# Deploy
git push heroku main
```

### Deploy to AWS/VPS

1. Install Node.js and MongoDB
2. Clone repository
3. Install PM2: `npm install -g pm2`
4. Start application: `pm2 start server.js --name storage-api`
5. Set up Nginx reverse proxy
6. Configure SSL certificate

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js community for the excellent framework
- MongoDB team for the powerful database
- All contributors who have helped improve this project

## 📞 Support

For support, email eiasinprodhan@gmail.com or open an issue on GitHub.

---

Made with ❤️ by [Eiasin Prodhan](https://github.com/eiasinprodhan)
