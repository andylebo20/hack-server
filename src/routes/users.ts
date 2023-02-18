import expressRouter from 'express-promise-router';
import { UserController } from 'src/controllers/UserController';

const router = expressRouter();

router.get("/me", UserController.getMe);

export default router;
