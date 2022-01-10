import { Router } from "express";
import { UserService } from "../../controllers/users";
import upload from "../../middlewares/users/upload";
import { validateUploadAvatar } from "../../middlewares/users/validateAvatar";
import guard from "../../middlewares/users/guard";
const avatarRouter = new Router();
const usersService = new UserService();

avatarRouter.patch(
  "/avatars",
  [guard, upload.single("avatar"), validateUploadAvatar],
  usersService.addAvatars
);

export default avatarRouter;
