import { Router } from "express";
import { uploadAvatar } from "../../controllers/avatars/avatars";
import upload from "../../middlewares/users/upload";
import guard from "../../middlewares/users/guard";
const avatarRouter = new Router();

avatarRouter.patch("/avatars", guard, upload.single("avatar"), uploadAvatar);

export default avatarRouter;
