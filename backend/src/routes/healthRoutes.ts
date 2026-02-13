import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';

const router = Router();
const controller = new HealthController();

router.get('/health', (req, res, next) => controller.health(req, res).catch(next));

router.get('/ready', (req, res, next) => controller.readiness(req, res).catch(next));

export default router;
