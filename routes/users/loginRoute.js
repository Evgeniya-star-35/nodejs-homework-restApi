import { Router } from "express";
import UserService from "../../controllers/users";
const usersService = new UserService();
const loginRouter = new Router();

loginRouter.post("/login", usersService.login);

export default loginRouter;
