import { Router } from "express";
import guard from "../../middlewares/users/guard";
import { UserService } from "../../controllers/users";
const usersService = new UserService();

const logoutRouter = new Router();

logoutRouter.get("/logout", guard, usersService.logout);

export default logoutRouter;
