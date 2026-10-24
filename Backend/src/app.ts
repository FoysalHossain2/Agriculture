import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { CORS_ALLOWED_ORIGINS } from './constants';
import router from './routes/index';
import errorHandler from './middlewares/errorHandler';
import { ApiError } from './utils/ApiError';

const app: Application = express();

// ─────────────────────────────────────────────
// Security Middlewares
// ─────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || CORS_ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin ${origin} is not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─────────────────────────────────────────────
// Body Parsing Middlewares
// ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─────────────────────────────────────────────
// Logging Middleware
// ─────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
app.use('/api/v1', router);

// ─────────────────────────────────────────────
// 404 Handler (must be after all routes)
// ─────────────────────────────────────────────
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Route not found'));
});

// ─────────────────────────────────────────────
// Global Error Handler (must be last middleware)
// ─────────────────────────────────────────────
app.use(errorHandler);

export default app;
