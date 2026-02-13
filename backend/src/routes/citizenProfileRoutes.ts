import { Router } from 'express';
import { CitizenProfileController } from '../controllers/CitizenProfileController';
import { authMiddleware } from '../middlewares/auth';
import { validateRequest, validateQueryParams } from '../validators/middleware';
import {
  createCitizenProfileSchema,
  updateCitizenProfileSchema,
  paginationSchema,
} from '../validators/schemas';

const router = Router();
const controller = new CitizenProfileController();

router.post('/', authMiddleware, validateRequest(createCitizenProfileSchema), (req, res, next) =>
  controller.createProfile(req, res).catch(next)
);

router.get(
  '/',
  authMiddleware,
  validateQueryParams(paginationSchema),
  (req, res, next) => controller.getProfiles(req, res).catch(next)
);

router.get('/:id', authMiddleware, (req, res, next) =>
  controller.getProfile(req, res).catch(next)
);

router.get('/user/:userId', authMiddleware, (req, res, next) =>
  controller.getProfileByUserId(req, res).catch(next)
);

router.put('/:id', authMiddleware, validateRequest(updateCitizenProfileSchema), (req, res, next) =>
  controller.updateProfile(req, res).catch(next)
);

router.delete('/:id', authMiddleware, (req, res, next) =>
  controller.deleteProfile(req, res).catch(next)
);

export default router;
