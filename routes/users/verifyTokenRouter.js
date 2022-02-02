import { Router } from "express";
const verifyTokenRouter = new Router();
import UserService from "../../controllers/users";
const newUserService = new UserService();

verifyTokenRouter.get("/verify/:token", newUserService.verifyUser);

export default verifyTokenRouter;
