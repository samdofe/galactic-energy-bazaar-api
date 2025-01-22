import { Router } from 'express';
import authRoutes from './auth.routes';
import planetsRoutes from "./planets.routes";
import tradesRoutes from "./trades.routes";
import userRoutes from './user.routes';
import {authenticate} from "../middleware/auth.middleware";

const API_VERSION = process.env.API_VERSION || 'v1';
const router = Router();

router.use(`/${API_VERSION}/auth`, authRoutes);
router.use(`/${API_VERSION}/planets`, authenticate, planetsRoutes);
router.use(`/${API_VERSION}/trades`, authenticate, tradesRoutes);
router.use(`/${API_VERSION}/users`, authenticate, userRoutes);

export default router;