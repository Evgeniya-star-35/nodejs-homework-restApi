import { HttpCode } from "../../lib/constants";
import gravatar from "gravatar";
import AuthService from "../../service/userAuth/authService";
// import * as path from "path";
import names from "../../repository/users";
const authService = new AuthService();
class UserService {
  async getCurrentUser(req, res) {
    const { email, subscription } = req.user;
    if (!req.user.token || !req.user.id) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }
    res.json({
      status: "success",
      code: HttpCode.OK,
      data: {
        user: {
          email,
          subscription,
        },
      },
    });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await authService.getUser(email, password);
    console.log(user);
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }
    const token = authService.getToken(user);
    await authService.setToken(user.id, token);
    res
      .status(HttpCode.OK)
      .json({ status: "success", code: HttpCode.OK, data: { token } });
  }

  async logout(req, res, next) {
    await authService.setToken(req.user.id, null);
    res
      .status(HttpCode.NO_CONTENT)
      .json({ status: "success", code: HttpCode.OK, data: {} });
  }

  async registration(req, res, next) {
    const { email } = req.body;
    const isUserExist = await authService.isUserExist(email);
    if (isUserExist) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }
    const avatarURL = gravatar.url(email);
    const data = await authService.create({ ...req.body, avatarURL });
    res
      .status(HttpCode.CREATED)
      .json({ status: "success", code: HttpCode.CREATED, data });
  }

  // async updateSubscription(req, res, next) {
  //   try {
  //     const id = req.user.id;
  //     const subscription = req.body.subscription;
  //     await names.updateSub(id, subscription);

  //     return res.status(HttpCode.OK).json({
  //       status: "success",
  //       code: HttpCode.OK,
  //       data: {
  //         id,
  //         email: req.user.email,
  //         subscription,
  //       },
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async updateSubscription(req, res, next) {
    const token = req.token;
    const { subscription } = req.body;
    const { _id: userId } = req.user;
    const currentUser = await names.updateSub({ token, subscription }, userId);
    res.status(200).json({ currentUser });
  }

  async addAvatars(req, res, next) {
    const { file } = req;
    const { _id: userId, avatarURL } = req.user;
    const newPathAvatar = await names.updateAvatar({
      userId,
      file,
      avatarURL,
    });
    res.status(200).json({
      status: "success",
      code: HttpCode.OK,
      avatarURL: newPathAvatar,
    });
  }

  // async addAvatar(req, res) {
  //   const { description } = req.body;
  //   const { _id, token } = req.user;
  //   const { path: tempDir, originalname } = req.file;
  //   Jimp.read(tempDir, (err, lenna) => {
  //     if (err) throw err;
  //     lenna.resize(250, 250).quality(60);
  //   });

  //   if (token === null) {
  //     res.json({
  //       status: "error",
  //       code: HttpCode.UNAUTHORIZED,
  //       message: "Not Authorized",
  //     });
  //   }
  //   try {
  //     const [extention] = originalname.split(".").reverse();
  //     const newAvatarName = `avatar-${_id}.${extention}`;
  //     const resultDir = path.join(avatarsDir, newAvatarName);
  //     await fs.rename(tempDir, resultDir);
  //     const avatar = path.join("/avatars", newAvatarName);
  //     await User.findByIdAndUpdate(_id, { avatarURL: avatar });
  //     res.json({
  //       description,
  //       status: HttpCode.OK,
  //       avatarURL: avatar,
  //     });
  //   } catch (error) {
  //     await fs.unlink(tempDir);
  //     throw error;
  //   }
  // }
}
export default UserService;
