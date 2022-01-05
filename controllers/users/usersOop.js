import { HttpCode } from "../../lib/constants";
import AuthService from "../../service/userAuth/authService";
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
    const data = await authService.create(req.body);
    res
      .status(HttpCode.OK)
      .json({ status: "success", code: HttpCode.OK, data });
  }
}
export default UserService;
