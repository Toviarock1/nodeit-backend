# NodeIT Backend

A robust RESTful API backend for project and task management built with Node.js, Express, and Prisma ORM.

## 🚀 Features

- **User Authentication** - Secure JWT-based authentication system with registration and login
- **Project Management** - Create, read, update, and delete projects
- **Todo Management** - Organize tasks within projects with priority and status tracking
- **Input Validation** - Request validation using Yup schema validation
- **Security** - Built-in security middleware (Helmet, CORS, compression)
- **Error Handling** - Centralized error handling with Winston logging
- **Database** - PostgreSQL with Prisma ORM for type-safe database operations

## 📁 Project Structure

```
nodeit-backend/
├── index.js                 # Application entry point
├── app.js                   # Express app configuration
├── package.json             # Project dependencies
├── constants/
│   └── statusCodes.js       # HTTP status codes constants
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User profile operations
│   ├── projectController.js # Project CRUD operations
│   └── todoController.js    # Todo CRUD operations
├── middlewares/
│   ├── authMiddleware.js    # JWT authentication verification
│   └── errorMidddleware.js  # Global error handling
├── prisma/
│   └── schema.prisma        # Database schema definition
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── user.js              # User routes
│   ├── project.js           # Project routes
│   └── todo.js              # Todo routes
├── startup/
│   └── prod.js              # Production middleware setup
├── utils/
│   ├── prisma.js            # Prisma client instance
│   └── responseObject.js    # Standardized response format
└── validations/
    ├── authValidations.js   # Login/register validation schemas
    ├── projectValidation.js # Project validation schemas
    └── todoValidation.js    # Todo validation schemas
```

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt
- **Validation:** Yup
- **Logging:** Winston
- **Security:** Helmet, CORS, compression
- **Additional:** lodash, morgan, body-parser

## 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd nodeit-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/nodeit?schema=public"
   JWT_SECRET="your-jwt-secret-key"
   EXPIRY_TIME="1d"
   PORT=5050
   ```

4. **Set up the database:**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔑 API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint    | Description       | Auth Required |
| ------ | ----------- | ----------------- | ------------- |
| POST   | `/login`    | User login        | No            |
| POST   | `/register` | User registration | No            |

### User Routes (`/api/v1/user`)

| Method | Endpoint   | Description      | Auth Required |
| ------ | ---------- | ---------------- | ------------- |
| GET    | `/profile` | Get user profile | Yes           |

### Project Routes (`/api/v1/project`)

| Method | Endpoint             | Description          | Auth Required |
| ------ | -------------------- | -------------------- | ------------- |
| POST   | `/create`            | Create a new project | Yes           |
| GET    | `/user-project`      | Get user's projects  | Yes           |
| PATCH  | `/update/:projectId` | Update a project     | Yes           |
| DELETE | `/delete/:projectId` | Delete a project     | Yes           |

### Todo Routes (`/api/v1/todo`)

| Method | Endpoint                    | Description                   | Auth Required |
| ------ | --------------------------- | ----------------------------- | ------------- |
| POST   | `/create`                   | Create a new todo             | Yes           |
| GET    | `/project-todos/:projectid` | Get todos by project & status | Yes           |
| PATCH  | `/update`                   | Update a todo                 | Yes           |
| DELETE | `/delete/:todoid`           | Delete a todo                 | Yes           |

## 📝 Request & Response Examples

### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Standard Response Format

```json
{
  "message": "Operation successful",
  "status": 200,
  "success": true,
  "data": {
    // response data here
  }
}
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Payload

```json
{
  "id": "user-uuid",
  "name": "John Doe",
  "email": "john@example.com"
}
```

## 🗄 Database Schema

### User Model

- `id` - UUID primary key
- `email` - Unique email address
- `password` - Hashed password
- `firstname` - User's first name
- `lastname` - User's last name
- `isVerified` - Email verification status
- `otp` - One-time password for verification
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Project Model

- `id` - UUID primary key
- `title` - Project title
- `about` - Project description
- `completed` - Completion status
- `completedAt` - Completion timestamp
- `expiresAt` - Expiration date
- `userId` - Foreign key to User
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Todo Model

- `id` - UUID primary key
- `title` - Todo title
- `description` - Todo description
- `priority` - Priority level
- `status` - pending/inprogress/completed
- `completed` - Completion status
- `completedAt` - Completion timestamp
- `todoId` - Foreign key to Project
- `expiresAt` - Expiration date
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## 🧪 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Run tests
npm test
```

### Error Logging

- Error logs are written to `error.log`
- Combined logs are written to `combined.log`
- Winston logger captures all errors and informational messages

## 🚢 Production Deployment

The application includes production middleware:

- **Helmet** - Security headers
- **Compression** - Gzip compression

To deploy to production:

```bash
# Build/start for production
node index.js
```

## 📄 License

ISC License

## 👤 Author

Simon Adama(Toviarock1)
