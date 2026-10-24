import { Router } from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import farmerRouter from './farmer.routes';
import buyerRouter from './buyer.routes';
import expertRouter from './expert.routes';
import serviceProviderRouter from './serviceProvider.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: '🌱 Agriculture API is running',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/farmer', farmerRouter);
router.use('/buyer', buyerRouter);
router.use('/expert', expertRouter);
router.use('/service-provider', serviceProviderRouter);

export default router;
