import { HttpCode } from "../../lib/constants";
import authService from "../../service/userAuth/authService";
import {
  EmailService,
  SenderNodemailer,
  SenderSendGrid,
} from "../../service/email";
import {
  findByVerifyToken,
  updateVerify,
  findByEmail,
} from "../../repository/users";
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
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "invalid credentials",
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
    try {
      const { email } = req.body;
      const isUserExist = await authService.isUserExist(email);
      if (isUserExist) {
        return res.status(HttpCode.CONFLICT).json({
          status: "error",
          code: HttpCode.CONFLICT,
          message: "Email is already exist",
        });
      }
      const userData = await authService.create(req.body);
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new SenderSendGrid()
      );

      const isSend = await emailService.sendVerifyEmail(
        email,
        userData.name,
        userData.verifyTokenEmail
      );
      delete userData.verifyTokenEmail;

      res.status(HttpCode.CREATED).json({
        status: "success",
        code: HttpCode.CREATED,
        data: { ...userData, isSendEmailVerify: isSend },
      });
    } catch (error) {
      next(error);
    }
  }
  async verifyUser(req, res, next) {
    const verifyToken = req.params.token;
    const userFromToken = await findByVerifyToken(verifyToken);

    if (userFromToken) {
      await updateVerify(userFromToken.id, true);
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: { message: "Success" },
      });
    }
    res.status(HttpCode.BAD_REQUEST).json({
      status: "success",
      code: HttpCode.BAD_REQUEST,
      data: { message: "Invalid token" },
    });
  }

  async repeatEmailForVerifyUser(req, res, next) {
    const { email } = req.body;
    const user = await findByEmail(email);
    if (user) {
      const { email, name, verifyTokenEmail } = user;
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new SenderSendGrid()
      );

      const isSend = await emailService.sendVerifyEmail(
        email,
        name,
        verifyTokenEmail
      );
      if (isSend) {
        return res.status(HttpCode.OK).json({
          status: "success",
          code: HttpCode.OK,
          data: { message: "Verification email sent" },
        });
      }
      return res.status(HttpCode.SE).json({
        status: "error",
        code: HttpCode.SE,
        data: { message: "Service Temporarily Unavailable" },
      });
    }

    res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      data: { message: "User with email not found" },
    });
  }
}

export default UserService;
