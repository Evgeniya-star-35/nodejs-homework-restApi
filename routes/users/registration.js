import { Router } from "express";
import limiter from "../../middlewares/users/rateLimit";
import UserService from "../../controllers/users";
const usersService = new UserService();

const registrationRouter = new Router();

registrationRouter.post(
  "/signup",
  limiter(15 * 60 * 1000, 2),
  usersService.registration
);

export default registrationRouter;
