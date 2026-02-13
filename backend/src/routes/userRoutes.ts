import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth';
import { validateRequest, validateQueryParams } from '../validators/middleware';
import { createUserSchema, updateUserSchema, paginationSchema } from '../validators/schemas';

const router = Router();
const controller = new UserController();

router.post('/', validateRequest(createUserSchema), (req, res, next) =>
  controller.createUser(req, res).catch(next)
);

router.get(
  '/',
  authMiddleware,
  validateQueryParams(paginationSchema),
  (req, res, next) => controller.getUsers(req, res).catch(next)
);

router.get('/:id', authMiddleware, (req, res, next) =>
  controller.getUser(req, res).catch(next)
);

router.put('/:id', authMiddleware, validateRequest(updateUserSchema), (req, res, next) =>
  controller.updateUser(req, res).catch(next)
);

router.delete('/:id', authMiddleware, (req, res, next) =>
  controller.deleteUser(req, res).catch(next)
);

export default router;
