import jwt from "jsonwebtoken";
import { createUser, findByEmail, updateToken } from "../../repository/users";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

class AuthService {
  async create(body) {
    const { id, name, email, role, avatar, verifyTokenEmail } =
      await createUser(body);
    return {
      id,
      name,
      email,
      role,
      avatar,
      verifyTokenEmail,
    };
  }

  getToken(user) {
    const { id } = user;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1w" });
    return token;
  }

  async getUser(email, password) {
    const user = await findByEmail(email);
    const isValidPassword = await user?.isValidPassword(password);
    if (!isValidPassword || !null?.isVerify) {
      return null;
    }
    return user;
  }

  async isUserExist(email) {
    const user = await findByEmail(email);
    return !!user;
  }

  async setToken(id, token) {
    await updateToken(id, token);
  }
}

export default new AuthService();
