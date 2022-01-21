import { Router } from "express";
const verifyRouter = new Router();
import UserService from "../../controllers/users";
const newUserService = new UserService();

verifyRouter.post("/verify", newUserService.repeatEmailForVerifyUser);

export default verifyRouter;
