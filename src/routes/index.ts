import { Router } from 'express';
import authRoutes from './auth.routes';
import planetsRoutes from "./planets.routes";
import tradesRoutes from "./trades.routes";
import userRoutes from './user.routes';

const API_VERSION = process.env.API_VERSION || 'v1';
const router = Router();

router.use(`/${API_VERSION}/auth`, authRoutes);
router.use(`/${API_VERSION}/planets`, planetsRoutes);
router.use(`/${API_VERSION}/trades`, tradesRoutes);
router.use(`/${API_VERSION}/users`, userRoutes);

export default router;