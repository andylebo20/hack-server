import expressRouter from "express-promise-router";
import users from "./users";

const router = expressRouter();

router.use("/users", users);

export default router;
