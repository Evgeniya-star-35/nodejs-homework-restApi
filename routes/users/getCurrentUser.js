import { Router } from "express";
import guard from "../../middlewares/users/guard";
import { UserService } from "../../controllers/users";
const usersService = new UserService();
const currentRouter = new Router();

currentRouter.get("/current", guard, usersService.getCurrentUser);

export default currentRouter;
