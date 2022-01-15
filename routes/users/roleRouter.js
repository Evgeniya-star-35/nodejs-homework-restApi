import { Router } from "express";
import { aggregation } from "../../controllers/avatars/avatars";
import guard from "../../middlewares/users/guard";
import roleAccess from "../../middlewares/users/roleAccess";
import { Role } from "../../lib/constants";
const roleRouter = new Router();
roleRouter.get("/stats/:id", guard, roleAccess(Role.ADMIN), aggregation);

export default roleRouter;
