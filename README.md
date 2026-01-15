# Complete Postman Collection & README

## 1. Postman Collection JSON

Save this as `Storage-Management-System.postman_collection.json`:

```json
{
  "info": {
    "_postman_id": "Storage-Management-System-collection",
    "name": "Storage Management API",
    "description": "Complete API collection for Storage Management System.\n\n## Features\n- User Authentication (Email & Google OAuth)\n- File Management\n- Folder Management\n- Storage Analytics\n- Secret Files with PIN protection\n\n## Getting Started\n1. Import this collection\n2. Import the environment\n3. Run 'Register' then 'Verify Email' or 'Login'\n4. Token will be automatically saved\n5. Test other endpoints\n\n## Base URL\n`http://localhost:5000/api`",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    },
    {
      "key": "userId",
      "value": "",
      "type": "string"
    },
    {
      "key": "verificationCode",
      "value": "",
      "type": "string"
    },
    {
      "key": "resetCode",
      "value": "",
      "type": "string"
    },
    {
      "key": "folderId",
      "value": "",
      "type": "string"
    },
    {
      "key": "secretFolderId",
      "value": "",
      "type": "string"
    },
    {
      "key": "fileId",
      "value": "",
      "type": "string"
    },
    {
      "key": "testEmail",
      "value": "testuser@example.com",
      "type": "string"
    },
    {
      "key": "testPassword",
      "value": "Test@123456",
      "type": "string"
    },
    {
      "key": "secretPin",
      "value": "1234",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "🔐 Authentication",
      "description": "User authentication endpoints including registration, login, email verification, and password reset.",
      "item": [
        {
          "name": "Register User",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const response = pm.response.json();",
                  "",
                  "pm.test('Status code is 201', function () {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  "pm.test('Response has success property', function () {",
                  "    pm.expect(response).to.have.property('success');",
                  "});",
                  "",
                  "if (response.success) {",
                  "    pm.test('Response has userId', function () {",
                  "        pm.expect(response).to.have.property('userId');",
                  "    });",
                  "    ",
                  "    // Save variables",
                  "    pm.collectionVariables.set('userId', response.userId);",
                  "    ",
                  "    if (response.code) {",
                  "        pm.collectionVariables.set('verificationCode', response.code);",
                  "        console.log('Verification Code:', response.code);",
                  "    }",
                  "}"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"name\": \"Test User\",\n    \"email\": \"{{testEmail}}\",\n    \"password\": \"{{testPassword}}\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            },
            "description": "Register a new user account.\n\n**Request Body:**\n- `name` (required): User's full name\n- `email` (required): User's email address\n- `password` (required): User's password (min 6 characters)\n\n**Response:**\n- `success`: Boolean indicating success\n- `message`: Response message\n- `userId`: Created user's ID\n- `code`: Verification code (only in development mode)"
          },
          "response": [
            {
              "name": "Success Response",
              "status": "Created",
              "code": 201,
              "body": "{\n    \"success\": true,\n    \"message\": \"Registration successful. Please check your email for verification code.\",\n    \"userId\": \"65a1234567890abc1234567\",\n    \"code\": \"453621\"\n}"
            }
          ]
        },
        {
          "name": "Verify Email",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const response = pm.response.json();",
                  "",
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response has token', function () {",
                  "    pm.expect(response).to.have.property('token');",
                  "});",
                  "",
                  "if (response.token) {",
                  "    pm.collectionVariables.set('token', response.token);",
                  "    console.log('Token saved successfully');",
                  "}"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"email\": \"{{testEmail}}\",\n    \"code\": \"{{verificationCode}}\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/verify-email",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "verify-email"]
            },
            "description": "Verify user's email with the code sent during registration.\n\n**Request Body:**\n- `email` (required): User's email address\n- `code` (required): 6-digit verification code\n\n**Response:**\n- `success`: Boolean indicating success\n- `message`: Response message\n- `token`: JWT token for authentication\n- `user`: User object with id, name, email"
          },
          "response": [
            {
              "name": "Success Response",
              "status": "OK",
              "code": 200,
              "body": "{\n    \"success\": true,\n    \"message\": \"Email verified successfully\",\n    \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\",\n    \"user\": {\n        \"id\": \"65a1234567890abc1234567\",\n        \"name\": \"Test User\",\n        \"email\": \"testuser@example.com\"\n    }\n}"
            }
          ]
        },
        {
          "name": "Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const response = pm.response.json();",
                  "",
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response has token', function () {",
                  "    pm.expect(response).to.have.property('token');",
                  "});",
                  "",
                  "pm.test('Response has user object', function () {",
                  "    pm.expect(response).to.have.property('user');",
                  "});",
                  "",
                  "if (response.token) {",
                  "    pm.collectionVariables.set('token', response.token);",
                  "    pm.collectionVariables.set('userId', response.user.id);",
                  "    console.log('Token saved successfully');",
                  "}"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"email\": \"{{testEmail}}\",\n    \"password\": \"{{testPassword}}\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            },
            "description": "Login with email and password.\n\n**Request Body:**\n- `email` (required): User's email address\n- `password` (required): User's password\n\n**Response:**\n- `success`: Boolean indicating success\n- `token`: JWT token for authentication\n- `user`: User object with id, name, email"
          },
          "response": [
            {
              "name": "Success Response",
              "status": "OK",
              "code": 200,
              "body": "{\n    \"success\": true,\n    \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\",\n    \"user\": {\n        \"id\": \"65a1234567890abc1234567\",\n        \"name\": \"Test User\",\n        \"email\": \"testuser@example.com\"\n    }\n}"
            }
          ]
        },
        {
          "name": "Forgot Password",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const response = pm.response.json();",
                  "",
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "if (response.code) {",
                  "    pm.collectionVariables.set('resetCode', response.code);",
                  "    console.log('Reset Code:', response.code);",
                  "}"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"email\": \"{{testEmail}}\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/forgot-password",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "forgot-password"]
            },
            "description": "Request a password reset code.\n\n**Request Body:**\n- `email` (required): User's email address\n\n**Response:**\n- `success`: Boolean indicating success\n- `message`: Response message\n- `code`: Reset code (only in development mode)"
          },
          "response": [
            {
              "name": "Success Response",
              "status": "OK",
              "code": 200,
              "body": "{\n    \"success\": true,\n    \"message\": \"Reset code sent to your email\",\n    \"code\": \"892345\"\n}"
            }
          ]
        },
        {
          "name": "Reset Password",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "const response = pm.response.json();",
                  "pm.test('Response has success message', function () {",
                  "    pm.expect(response.success).to.be.true;",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"email\": \"{{testEmail}}\",\n    \"code\": \"{{resetCode}}\",\n    \"newPassword\": \"NewPassword@123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/reset-password",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "reset-password"]
            },
            "description": "Reset password using the code sent via email.\n\n**Request Body:**\n- `email` (required): User's email address\n- `code` (required): 6-digit reset code\n- `newPassword` (required): New password\n\n**Response:**\n- `success`: Boolean indicating success\n- `message`: Response message"
          },
          "response": [
            {
              "name": "Success Response",
              "status": "OK",
              "code": 200,
              "body": "{\n    \"success\": true,\n    \"message\": \"Password reset successful. You can now login with your new password.\"\n}"
            }
          ]
        },
        {
          "name": "Google OAuth",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/auth/google",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "google"]
            },
            "description": "Initiate Google OAuth login.\n\n**Note:** This will redirect to Google login page. Use in browser, not Postman."
          },
          "response": []
        }
      ]
    },
    {
      "name": "👤 User Management",
      "description": "User profile management endpoints.",
      "item": [
        {
          "name": "Get Profile",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const response = pm.response.json();",
                  "",
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response has user data', function () {",
                  "    pm.expect(response).to.have.property('user');",
                  "    pm.expect(response.user).to.have.property('email');",
                  "    pm.expect(response.user).to.have.property('name');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/user/profile",
              "host": ["{{baseUrl}}"],
              "path": ["user", "profile"]
            },
            "description": "Get current user's profile.\n\n**Headers:**\n- `Authorization`: Bearer token\n\n**Response:**\n- `success`: Boolean indicating success\n- `user`: User profile object"
          },
          "response": [
            {
              "name": "Success Response",
              "status": "OK",
              "code": 200,
              "body": "{\n    \"success\": true,\n    \"user\": {\n        \"_id\": \"65a1234567890abc1234567\",\n        \"name\": \"Test User\",\n        \"email\": \"testuser@example.com\",\n        \"isVerified\": true,\n        \"storageLimit\": 16106127360,\n        \"usedStorage\": 52428800,\n        \"avatar\": null,\n        \"createdAt\": \"2024-01-15T10:00:00.000Z\"\n    }\n}"
            }
          ]
        },
        {
          "name": "Update Profile",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "const response = pm.response.json();",
                  "pm.test('Profile updated', function () {",
                  "    pm.expect(response.success).to.be.true;",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"name\": \"Updated Name\",\n    \"avatar\": \"https://example.com/avatar.jpg\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/user/profile",
              "host": ["{{baseUrl}}"],
              "path": ["user", "profile"]
            },
            "description": "Update current user's profile.\n\n**Headers:**\n- `Authorization`: Bearer token\n\n**Request Body:**\n- `name` (optional): Updated name\n- `avatar` (optional): Avatar URL"
          },
          "response": [
            {
              "name": "Success Response",
              "status": "OK",
              "code": 200,
              "body": "{\n    \"success\": true,\n    \"user\": {\n        \"_id\": \"65a1234567890abc1234567\",\n        \"name\": \"Updated Name\",\n        \"email\": \"testuser@example.com\",\n        \"avatar\": \"https://example.com/avatar.jpg\"\n    }\n}"
            }
          ]
        },
        {
          "name": "Set Secret PIN",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "const response = pm.response.json();",
                  "pm.test('PIN set successfully', function () {",
                  "    pm.expect(response.success).to.be.true;",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"pin\": \"{{secretPin}}\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/user/set-pin",
              "host": ["{{baseUrl}}"],
              "path": ["user", "set-pin"]
            },
            "description": "Set a secret PIN for accessing secret files and folders.\n\n**Headers:**\n- `Authorization`: Bearer token\n\n**Request Body:**\n- `pin` (required): 4-6 digit PIN"
          },
          "response": [
            {
              "name": "Success Response",
              "status": "OK",
              "code": 200,
              "body": "{\n    \"success\": true,\n    \"message\": \"Secret PIN set successfully\"\n}"
            }
          ]
        },
        {
          "name": "Change Password",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"currentPassword\": \"{{testPassword}}\",\n    \"newPassword\": \"NewSecure@123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/user/change-password",
              "host": ["{{baseUrl}}"],
              "path": ["user", "change-password"]
            },
            "description": "Change current user's password.\n\n**Headers:**\n- `Authorization`: Bearer token\n\n**Request Body:**\n- `currentPassword` (required): Current password\n- `newPassword` (required): New password"
          },
          "response": [
            {
              "name": "Success Response",
              "status": "OK",
              "code": 200,
              "body": "{\n    \"success\": true,\n    \"message\": \"Password changed successfully\"\n}"
            }
          ]
        },
        {
          "name": "Delete Account",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/user/delete-account",
              "host": ["{{baseUrl}}"],
              "path": ["user", "delete-account"]
            },
            "description": "Delete current user's account and all associated data.\n\n**Headers:**\n- `Authorization`: Bearer token\n\n**Warning:** This action is irreversible!"
          },
          "response": [
            {
              "name": "Success Response",
              "status": "OK",
              "code": 200,
              "body": "{\n    \"success\": true,\n    \"message\": \"Account deleted successfully\"\n}"
            }
          ]
        }
      ]
    },
    {
      "name": "📁 Folder Management",
      "description": "Folder creation and management endpoints.",
      "item": [
        {
          "name": "Create Folder",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const response = pm.response.json();",
                  "",
                  "pm.test('Status code is 201', function () {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  "pm.test('Folder created', function () {",
                  "    pm.expect(response).to.have.property('_id');",
                  "    pm.expect(response).to.have.property('name');",
                  "});",
                  "",
                  "if (response._id) {",
                  "    pm.collectionVariables.set('folderId', response._id);",
                  "    console.log('Folder ID saved:', response._id);",
                  "}"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"name\": \"Work Documents\",\n    \"isSecret\": false\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/folders",
              "host": ["{{baseUrl}}"],
              "path": ["folders"]
            },
            "description": "Create a new folder.\n\n**Headers:**\n- `Authorization`: Bearer token\n\n**Request Body:**\n- `name` (required): Folder name\n- `parent` (optional): Parent folder ID for nested folders\n- `isSecret` (optional): Boolean for secret folder"
          },
          "response": [
            {
              "name": "Success Response",
              "status": "Created",
              "code": 201,
              "body": "{\n    \"_id\": \"65b2345678901bcd2345678\",\n    \"name\": \"Work Documents\",\n    \"user\": \"65a1234567890abc1234567\",\n    \"parent\": null,\n    \"isSecret\": false,\n    \"createdAt\": \"2024-01-15T14:30:00.000Z\",\n    \"updatedAt\": \"2024-01-15T14:30:00.000Z\"\n}"
            }
          ]
        },
        {
          "name": "Create Subfolder",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const response = pm.response.json();",
                  "",
                  "pm.test('Status code is 201', function () {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  "pm.test('Subfolder has parent', function () {",
                  "    pm.expect(response.parent).to.not.be.null;",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"name\": \"Q1 Reports\",\n    \"parent\": \"{{folderId}}\",\n    \"isSecret\": false\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/folders",
              "host": ["{{baseUrl}}"],
              "path": ["folders"]
            },
            "description": "Create a subfolder inside an existing folder."
          },
          "response": []
        },
        {
          "name": "Create Secret Folder",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const response = pm.response.json();",
                  "",
                  "pm.test('Status code is 201', function () {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  "pm.test('Folder is secret', function () {",
                  "    pm.expect(response.isSecret).to.be.true;",
                  "});",
                  "",
                  "if (response._id) {",
                  "    pm.collectionVariables.set('secretFolderId', response._id);",
                  "}"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"name\": \"Private Documents\",\n    \"isSecret\": true\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/folders",
              "host": ["{{baseUrl}}"],
              "path": ["folders"]
            },
            "description": "Create a secret folder that requires PIN to access."
          },
          "response": []
        },
        {
          "name": "Get All Folders",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "const response = pm.response.json();",
                  "pm.test('Response is array', function () {",
                  "    pm.expect(response).to.be.an('array');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/folders",
              "host": ["{{baseUrl}}"],
              "path": ["folders"]
            },
            "description": "Get all non-secret folders for the current user."
          },
          "response": [
            {
              "name": "Success Response",
              "status": "OK",
              "code": 200,
              "body": "[\n    {\n        \"_id\": \"65b2345678901bcd2345678\",\n        \"name\": \"Work Documents\",\n        \"user\": \"65a1234567890abc1234567\",\n        \"parent\": null,\n        \"isSecret\": false,\n        \"createdAt\": \"2024-01-15T14:30:00.000Z\"\n    },\n    {\n        \"_id\": \"65b3456789012cde3456789\",\n        \"name\": \"Personal Photos\",\n        \"user\": \"65a1234567890abc1234567\",\n        \"parent\": null,\n        \"isSecret\": false,\n        \"createdAt\": \"2024-01-15T15:00:00.000Z\"\n    }\n]"
            }
          ]
        },
        {
          "name": "Get Secret Folders",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "const response = pm.response.json();",
                  "pm.test('Response is array', function () {",
                  "    pm.expect(response).to.be.an('array');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"pin\": \"{{secretPin}}\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/folders/secret",
              "host": ["{{baseUrl}}"],
              "path": ["folders", "secret"]
            },
            "description": "Get secret folders. Requires PIN verification.\n\n**Note:** You must set a PIN first using the 'Set Secret PIN' endpoint."
          },
          "response": []
        },
        {
          "name": "Update Folder",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"name\": \"Updated Folder Name\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/folders/{{folderId}}",
              "host": ["{{baseUrl}}"],
              "path": ["folders", "{{folderId}}"]
            },
            "description": "Update a folder's name."
          },
          "response": []
        },
        {
          "name": "Delete Folder",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/folders/{{folderId}}",
              "host": ["{{baseUrl}}"],
              "path": ["folders", "{{folderId}}"]
            },
            "description": "Delete a folder and all its contents."
          },
          "response": []
        }
      ]
    },
    {
      "name": "📄 File Management",
      "description": "File upload, download, and management endpoints.",
      "item": [
        {
          "name": "Upload File",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "const response = pm.response.json();",
                  "",
                  "pm.test('Status code is 201', function () {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  "pm.test('File uploaded', function () {",
                  "    pm.expect(response.success).to.be.true;",
                  "    pm.expect(response.file).to.have.property('_id');",
                  "});",
                  "",
                  "if (response.file && response.file._id) {",
                  "    pm.collectionVariables.set('fileId', response.file._id);",
                  "    console.log('File ID saved:', response.file._id);",
                  "}"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "file",
                  "type": "file",
                  "src": "",
                  "description": "Select a file to upload"
                },
                {
                  "key": "folder",
                  "value": "",
                  "type": "text",
                  "description": "Optional: Folder ID to upload to",
                  "disabled": true
                },
                {
                  "key": "isSecret",
                  "value": "false",
                  "type": "text",
                  "description": "Set to 'true' for secret file"
                }
              ]
            },
            "url": {
              "raw": "{{baseUrl}}/files/upload",
              "host": ["{{baseUrl}}"],
              "path": ["files", "upload"]
            },
            "description": "Upload a file.\n\n**Headers:**\n- `Authorization`: Bearer token\n\n**Form Data:**\n- `file` (required): File to upload (File type)\n- `folder` (optional): Folder ID to upload to\n- `isSecret` (optional): 'true' or 'false'\n\n**Supported File Types:**\n- Images: jpg, jpeg, png, gif\n- Documents: pdf, doc, docx, txt\n\n**Max File Size:** 100MB"
          },
          "response": [
            {
              "name": "Success Response",
              "status": "Created",
              "code": 201,
              "body": "{\n    \"success\": true,\n    \"file\": {\n        \"_id\": \"65c5678901234ef5678901\",\n        \"originalName\": \"document.pdf\",\n        \"filename\": \"document-1705325400123-987654321.pdf\",\n        \"mimetype\": \"application/pdf\",\n        \"size\": 2457600,\n        \"type\": \"pdf\",\n        \"user\": \"65a1234567890abc1234567\",\n        \"folder\": null,\n        \"isFavorite\": false,\n        \"isSecret\": false,\n        \"createdAt\": \"2024-01-15T17:00:00.000Z\"\n    }\n}"
            }
          ]
        },
        {
          "name": "Upload File to Folder",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "file",
                  "type": "file",
                  "src": ""
                },
                {
                  "key": "folder",
                  "value": "{{folderId}}",
                  "type": "text"
                },
                {
                  "key": "isSecret",
                  "value": "false",
                  "type": "text"
                }
              ]
            },
            "url": {
              "raw": "{{baseUrl}}/files/upload",
              "host": ["{{baseUrl}}"],
              "path": ["files", "upload"]
            },
            "description": "Upload a file to a specific folder."
          },
          "response": []
        },
        {
          "name": "Upload Secret File",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "file",
                  "type": "file",
                  "src": ""
                },
                {
                  "key": "isSecret",
                  "value": "true",
                  "type": "text"
                }
              ]
            },
            "url": {
              "raw": "{{baseUrl}}/files/upload",
              "host": ["{{baseUrl}}"],
              "path": ["files", "upload"]
            },
            "description": "Upload a secret file that requires PIN to access."
          },
          "response": []
        },
        {
          "name": "Get All Files",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "const response = pm.response.json();",
                  "pm.test('Response has files array', function () {",
                  "    pm.expect(response).to.have.property('files');",
                  "    pm.expect(response.files).to.be.an('array');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/files",
              "host": ["{{baseUrl}}"],
              "path": ["files"]
            },
            "description": "Get all non-secret files for the current user."
          },
          "response": [
            {
              "name": "Success Response",
              "status": "OK",
              "code": 200,
              "body": "{\n    \"success\": true,\n    \"count\": 2,\n    \"files\": [\n        {\n            \"_id\": \"65c5678901234ef5678901\",\n            \"originalName\": \"document.pdf\",\n            \"filename\": \"document-1705325400123.pdf\",\n            \"mimetype\": \"application/pdf\",\n            \"size\": 2457600,\n            \"type\": \"pdf\",\n            \"folder\": null,\n            \"isFavorite\": false,\n            \"isSecret\": false,\n            \"createdAt\": \"2024-01-15T17:00:00.000Z\"\n        },\n        {\n            \"_id\": \"65c6789012345ef6789012\",\n            \"originalName\": \"photo.jpg\",\n            \"filename\": \"photo-1705325500456.jpg\",\n            \"mimetype\": \"image/jpeg\",\n            \"size\": 3145728,\n            \"type\": \"image\",\n            \"folder\": null,\n            \"isFavorite\": true,\n            \"isSecret\": false,\n            \"createdAt\": \"2024-01-15T17:30:00.000Z\"\n        }\n    ]\n}"
            }
          ]
        },
        {
          "name": "Get Files by Type",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/files?type=image",
              "host": ["{{baseUrl}}"],
              "path": ["files"],
              "query": [
                {
                  "key": "type",
                  "value": "image",
                  "description": "Filter by type: image, pdf, document"
                }
              ]
            },
            "description": "Get files filtered by type.\n\n**Query Parameters:**\n- `type`: image, pdf, or document"
          },
          "response": []
        },
        {
          "name": "Get Favorite Files",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/files?favorite=true",
              "host": ["{{baseUrl}}"],
              "path": ["files"],
              "query": [
                {
                  "key": "favorite",
                  "value": "true"
                }
              ]
            },
            "description": "Get all favorite files."
          },
          "response": []
        },
        {
          "name": "Get Files by Folder",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/files?folder={{folderId}}",
              "host": ["{{baseUrl}}"],
              "path": ["files"],
              "query": [
                {
                  "key": "folder",
                  "value": "{{folderId}}"
                }
              ]
            },
            "description": "Get files in a specific folder."
          },
          "response": []
        },
        {
          "name": "Get Secret Files",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"pin\": \"{{secretPin}}\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/files/secret",
              "host": ["{{baseUrl}}"],
              "path": ["files", "secret"]
            },
            "description": "Get secret files. Requires PIN verification."
          },
          "response": []
        },
        {
          "name": "Get Files by Date",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/files/calendar?date=2024-01-15",
              "host": ["{{baseUrl}}"],
              "path": ["files", "calendar"],
              "query": [
                {
                  "key": "date",
                  "value": "2024-01-15",
                  "description": "Date in YYYY-MM-DD format"
                }
              ]
            },
            "description": "Get files uploaded on a specific date."
          },
          "response": []
        },
        {
          "name": "Toggle Favorite",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "const response = pm.response.json();",
                  "pm.test('Favorite toggled', function () {",
                  "    pm.expect(response.file).to.have.property('isFavorite');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/files/{{fileId}}/favorite",
              "host": ["{{baseUrl}}"],
              "path": ["files", "{{fileId}}", "favorite"]
            },
            "description": "Toggle a file's favorite status."
          },
          "response": []
        },
        {
          "name": "Download File",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/files/download/{{fileId}}",
              "host": ["{{baseUrl}}"],
              "path": ["files", "download", "{{fileId}}"]
            },
            "description": "Download a file."
          },
          "response": []
        },
        {
          "name": "Delete File",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/files/{{fileId}}",
              "host": ["{{baseUrl}}"],
              "path": ["files", "{{fileId}}"]
            },
            "description": "Delete a file."
          },
          "response": []
        }
      ]
    },
    {
      "name": "📊 Storage Analytics",
      "description": "Storage statistics and calendar view endpoints.",
      "item": [
        {
          "name": "Get Storage Stats",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "const response = pm.response.json();",
                  "pm.test('Has storage info', function () {",
                  "    pm.expect(response).to.have.property('storageLimit');",
                  "    pm.expect(response).to.have.property('usedStorage');",
                  "    pm.expect(response).to.have.property('availableStorage');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/storage/stats",
              "host": ["{{baseUrl}}"],
              "path": ["storage", "stats"]
            },
            "description": "Get storage statistics for the current user."
          },
          "response": [
            {
              "name": "Success Response",
              "status": "OK",
              "code": 200,
              "body": "{\n    \"storageLimit\": 16106127360,\n    \"usedStorage\": 52428800,\n    \"availableStorage\": 16053698560,\n    \"usedPercentage\": \"0.33\",\n    \"totalFolders\": 3,\n    \"filesByType\": [\n        {\n            \"_id\": \"pdf\",\n            \"count\": 5,\n            \"totalSize\": 12582912\n        },\n        {\n            \"_id\": \"image\",\n            \"count\": 12,\n            \"totalSize\": 37748736\n        },\n        {\n            \"_id\": \"document\",\n            \"count\": 3,\n            \"totalSize\": 2097152\n        }\n    ]\n}"
            }
          ]
        },
        {
          "name": "Get Calendar Data",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "const response = pm.response.json();",
                  "pm.test('Response is array', function () {",
                  "    pm.expect(response).to.be.an('array');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/storage/calendar?month=1&year=2024",
              "host": ["{{baseUrl}}"],
              "path": ["storage", "calendar"],
              "query": [
                {
                  "key": "month",
                  "value": "1",
                  "description": "Month (1-12)"
                },
                {
                  "key": "year",
                  "value": "2024",
                  "description": "Year"
                }
              ]
            },
            "description": "Get files organized by date for calendar view."
          },
          "response": [
            {
              "name": "Success Response",
              "status": "OK",
              "code": 200,
              "body": "[\n    {\n        \"_id\": \"2024-01-15\",\n        \"count\": 3,\n        \"files\": [\n            {\n                \"name\": \"document.pdf\",\n                \"type\": \"pdf\"\n            },\n            {\n                \"name\": \"photo.jpg\",\n                \"type\": \"image\"\n            }\n        ]\n    },\n    {\n        \"_id\": \"2024-01-14\",\n        \"count\": 2,\n        \"files\": [\n            {\n                \"name\": \"report.pdf\",\n                \"type\": \"pdf\"\n            }\n        ]\n    }\n]"
            }
          ]
        }
      ]
    },
    {
      "name": "🏥 Health Check",
      "description": "API health check endpoint.",
      "item": [
        {
          "name": "API Health Check",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('API is running', function () {",
                  "    const response = pm.response.json();",
                  "    pm.expect(response).to.have.property('message');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:5000/",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": [""]
            },
            "description": "Check if the API is running."
          },
          "response": [
            {
              "name": "Success Response",
              "status": "OK",
              "code": 200,
              "body": "{\n    \"message\": \"Storage Management API\",\n    \"version\": \"1.0.0\",\n    \"endpoints\": {\n        \"auth\": \"/api/auth\",\n        \"user\": \"/api/user\",\n        \"folders\": \"/api/folders\",\n        \"files\": \"/api/files\",\n        \"storage\": \"/api/storage\"\n    }\n}"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 2. Complete README.md

````markdown
# 📦 Storage Management System API

A comprehensive Node.js-based cloud storage management system with email authentication, file management, folder organization, and secure file storage capabilities.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![Express.js](https://img.shields.io/badge/Express.js-4.18-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Postman Collection](#-postman-collection)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Testing Guide](#-testing-guide)
- [Error Handling](#-error-handling)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 Authentication

- ✅ Email & password registration with verification
- ✅ Email verification with 6-digit code
- ✅ Google OAuth 2.0 integration
- ✅ JWT-based authentication
- ✅ Password reset with email verification

### 👤 User Management

- ✅ User profile view and update
- ✅ Avatar support
- ✅ Password change
- ✅ Account deletion

### 📁 Folder Management

- ✅ Create, update, and delete folders
- ✅ Nested folder support (subfolders)
- ✅ Secret folders with PIN protection

### 📄 File Management

- ✅ Upload images, PDFs, and documents
- ✅ 15GB storage per user
- ✅ Organize files in folders
- ✅ Favorite files
- ✅ Secret files with PIN protection
- ✅ File download
- ✅ Calendar view by upload date

### 📊 Storage Analytics

- ✅ Real-time storage usage tracking
- ✅ File statistics by type
- ✅ Calendar view for uploaded files

---

## 🛠️ Tech Stack

| Technology      | Purpose               |
| --------------- | --------------------- |
| **Node.js**     | Runtime environment   |
| **Express.js**  | Web framework         |
| **MongoDB**     | Database              |
| **Mongoose**    | ODM for MongoDB       |
| **JWT**         | Authentication tokens |
| **Bcrypt.js**   | Password hashing      |
| **Multer**      | File upload handling  |
| **Nodemailer**  | Email sending         |
| **Passport.js** | Google OAuth          |

---

## 📚 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** v16.x or higher
- **MongoDB** v6.0 or higher
- **npm** or **yarn**
- **Git**
- **Postman** (for API testing)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/eiasinprodhan/storage-management-system.git
cd storage-management-system
```
````

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Required Directories

```bash
mkdir uploads
```

### Step 4: Set Up Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration.

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/storage_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRE=7d

# Storage Limit (15GB in bytes)
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

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Gmail Setup for Email

1. Enable 2-Factor Authentication in Google Account
2. Generate App Password:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate new app password
   - Use this password in `EMAIL_PASS`

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Expected Output

```
Server running on port 5000
MongoDB Connected Successfully
```

---

## 📖 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📮 Postman Collection

### Importing the Collection

1. Open Postman
2. Click **Import** button
3. Select `Storage-Management-System.postman_collection.json`
4. Collection will appear in your sidebar

### Collection Variables

| Variable       | Description                    | Default Value               |
| -------------- | ------------------------------ | --------------------------- |
| `baseUrl`      | API base URL                   | `http://localhost:5000/api` |
| `token`        | JWT token (auto-saved)         | -                           |
| `testEmail`    | Test user email                | `testuser@example.com`      |
| `testPassword` | Test user password             | `Test@123456`               |
| `secretPin`    | Secret PIN                     | `1234`                      |
| `folderId`     | Current folder ID (auto-saved) | -                           |
| `fileId`       | Current file ID (auto-saved)   | -                           |

### Testing Flow

1. **Health Check** - Verify API is running
2. **Register** - Create new account
3. **Verify Email** - Verify with code from response
4. **Login** - Get JWT token
5. **Set PIN** - Set secret PIN for protected files
6. **Create Folder** - Create a folder
7. **Upload File** - Upload a file
8. **Get Storage Stats** - View storage usage

---

## 📁 Project Structure

```
storage-management-system/
├── src/
│   ├── config/
│   │   ├── db.js                 # Database connection
│   │   └── passport.js           # Google OAuth config
│   ├── middlewares/
│   │   ├── auth.middleware.js    # Auth & PIN verification
│   │   └── upload.middleware.js  # File upload config
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.model.js     # User schema
│   │   │   └── auth.routes.js    # Auth endpoints
│   │   ├── user/
│   │   │   └── user.routes.js    # User endpoints
│   │   ├── folder/
│   │   │   ├── folder.model.js   # Folder schema
│   │   │   └── folder.routes.js  # Folder endpoints
│   │   ├── file/
│   │   │   ├── file.model.js     # File schema
│   │   │   └── file.routes.js    # File endpoints
│   │   └── storage/
│   │       └── storage.routes.js # Storage endpoints
│   └── utils/
│       └── email.js              # Email utility
├── uploads/                      # Uploaded files storage
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies
├── server.js                     # Entry point
├── README.md                     # Documentation
├── LICENSE                       # MIT License
└── Storage-Management-System.postman_collection.json
```

---

## 🔗 API Endpoints

### 🔐 Authentication

| Method | Endpoint                | Description            | Auth |
| ------ | ----------------------- | ---------------------- | ---- |
| `POST` | `/auth/register`        | Register new user      | ❌   |
| `POST` | `/auth/verify-email`    | Verify email with code | ❌   |
| `POST` | `/auth/login`           | Login user             | ❌   |
| `POST` | `/auth/forgot-password` | Request reset code     | ❌   |
| `POST` | `/auth/reset-password`  | Reset password         | ❌   |
| `GET`  | `/auth/google`          | Google OAuth           | ❌   |

### 👤 User

| Method   | Endpoint                | Description     | Auth |
| -------- | ----------------------- | --------------- | ---- |
| `GET`    | `/user/profile`         | Get profile     | ✅   |
| `PUT`    | `/user/profile`         | Update profile  | ✅   |
| `PUT`    | `/user/change-password` | Change password | ✅   |
| `PUT`    | `/user/set-pin`         | Set secret PIN  | ✅   |
| `DELETE` | `/user/delete-account`  | Delete account  | ✅   |

### 📁 Folders

| Method   | Endpoint          | Description        | Auth     |
| -------- | ----------------- | ------------------ | -------- |
| `POST`   | `/folders`        | Create folder      | ✅       |
| `GET`    | `/folders`        | Get all folders    | ✅       |
| `POST`   | `/folders/secret` | Get secret folders | ✅ + PIN |
| `PUT`    | `/folders/:id`    | Update folder      | ✅       |
| `DELETE` | `/folders/:id`    | Delete folder      | ✅       |

### 📄 Files

| Method   | Endpoint                          | Description      | Auth     |
| -------- | --------------------------------- | ---------------- | -------- |
| `POST`   | `/files/upload`                   | Upload file      | ✅       |
| `GET`    | `/files`                          | Get all files    | ✅       |
| `GET`    | `/files?type=image`               | Filter by type   | ✅       |
| `GET`    | `/files?favorite=true`            | Get favorites    | ✅       |
| `GET`    | `/files?folder=id`                | Get by folder    | ✅       |
| `POST`   | `/files/secret`                   | Get secret files | ✅ + PIN |
| `GET`    | `/files/calendar?date=YYYY-MM-DD` | Get by date      | ✅       |
| `PATCH`  | `/files/:id/favorite`             | Toggle favorite  | ✅       |
| `GET`    | `/files/download/:id`             | Download file    | ✅       |
| `DELETE` | `/files/:id`                      | Delete file      | ✅       |

### 📊 Storage

| Method | Endpoint                              | Description       | Auth |
| ------ | ------------------------------------- | ----------------- | ---- |
| `GET`  | `/storage/stats`                      | Get storage stats | ✅   |
| `GET`  | `/storage/calendar?month=1&year=2024` | Calendar data     | ✅   |

---

## 🧪 Testing Guide

### Quick Test with cURL

```bash
# 1. Health Check
curl http://localhost:5000/

# 2. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test@123"}'

# 3. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'

# 4. Get Profile (use token from login)
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Test Files

**Windows (PowerShell):**

```powershell
"Test content" | Out-File -FilePath test.txt
```

**Mac/Linux:**

```bash
echo "Test content" > test.txt
```

---

## ❌ Error Handling

### Common Error Responses

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Server Error:**

```json
{
  "success": false,
  "message": "Server error message"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Express.js community
- MongoDB team
- All contributors

---

## 📞 Support

- **Email:** eiasinprodhan@gmail.com
- **Issues:** [GitHub Issues](https://github.com/eiasinprodhan/SMS-Node-JS)

---

Made with ❤️ by [Your Name](https://github.com/eiasinprodhan)

```

---

## 3. How to Use

### Step 1: Save the Postman Collection

1. Create a new file: `Storage-Management-System.postman_collection.json`
2. Copy the JSON content above
3. Save the file

### Step 2: Import into Postman

1. Open Postman
2. Click **Import** (top left)
3. Drag and drop the JSON file or browse to select it
4. Click **Import**

### Step 3: Start Testing

1. Run **Health Check** first
2. Run **Register** to create account
3. Copy the `code` from response
4. Run **Verify Email** with the code
5. Token is automatically saved!
6. Test other endpoints

### Step 4: For File Upload

1. Go to **Upload File** request
2. In Body → form-data
3. Click on `file` row → change type from "Text" to "File"
4. Click "Select Files" and choose a file
5. Send request

---

Now you have a complete Postman collection with all endpoints documented and ready to test! 🚀
```
