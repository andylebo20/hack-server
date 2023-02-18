import expressRouter from "express-promise-router";
import { UserController } from "src/controllers/UserController";

const router = expressRouter();

router.get("/properties", UserController.getProperties);
router.get("/property/:id", UserController.getPropertyById);

router.post("/book", UserController.bookProperty);
router.post("/property", UserController.createNewProperty);

export default router;
