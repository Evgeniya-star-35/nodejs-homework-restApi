import { Router } from "express";
const verifyRouter = new Router();

verifyRouter.get("/verify/:verificationToken");

export default verifyRouter;
