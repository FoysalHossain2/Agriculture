# 🌾 Agriculture Backend API

A production-ready REST API built with **Node.js**, **Express**, **MongoDB**, and **TypeScript**.

---

## 🗂️ Folder Structure

```
Backend/
├── src/
│   ├── app.ts                  # Express app setup (middlewares, routes)
│   ├── server.ts               # Entry point (connects DB, starts server)
│   │
│   ├── config/
│   │   ├── config.ts           # All environment variables (typed)
│   │   └── database.ts         # MongoDB connection manager
│   │
│   ├── exceptions/
│   │   └── HttpException.ts    # Custom HTTP error classes
│   │
│   ├── middlewares/
│   │   ├── asyncHandler.ts     # Async route error wrapper
│   │   ├── auth.middleware.ts  # JWT authenticate + authorize guards
│   │   └── errorHandler.ts     # Global error handler
│   │
│   ├── modules/                # Feature modules (Model → Service → Controller → Routes)
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.routes.ts
│   │   │
│   │   └── user/
│   │       ├── user.model.ts
│   │       ├── user.service.ts
│   │       ├── user.controller.ts
│   │       └── user.routes.ts
│   │
│   ├── routes/
│   │   └── index.ts            # Central API router (/api/v1)
│   │
│   ├── types/
│   │   └── express.d.ts        # Express Request augmentation
│   │
│   └── utils/
│       ├── logger.ts           # Colored console logger
│       └── sendResponse.ts     # Standardized API response helper
│
├── .env                        # Environment variables (DO NOT commit)
├── .env.example                # Safe template for .env
├── .gitignore
├── nodemon.json                # Nodemon dev config
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Then fill in your values in .env
```

### 3. Run in development (hot-reload)
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
npm start
```

---

## 📡 API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and get tokens |
| POST | `/api/v1/auth/refresh-token` | Refresh access token |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users` | Get all users (paginated) |
| GET | `/api/v1/users/:id` | Get single user |
| PATCH | `/api/v1/users/:id` | Update user |
| DELETE | `/api/v1/users/:id` | Soft delete user |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Server health check |

---

## 🛡️ User Roles
- `admin` - Full access
- `farmer` - Default role
- `buyer` - Can browse/buy
- `expert` - Agricultural expert

---

## 🔧 Tech Stack
- **Runtime**: Node.js 22
- **Framework**: Express 4
- **Database**: MongoDB (Mongoose 8)
- **Language**: TypeScript 7
- **Auth**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS
- **Logging**: Morgan + custom logger
