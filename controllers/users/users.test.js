import { jest } from "@jest/globals";
import { UserService } from "./index";
import { HttpCode } from "../../lib/constants";
import authService from "../../service/userAuth/authService";
const userService = new UserService();

describe("Unit test registration", () => {
  // beforeAll(fn)
  // beforeEach(fn)
  // afterAll(fn)
  // afterEach(fn) функции,которые можно вызывать перед тестом
  let req, res, next;
  beforeEach(() => {
    req = { body: { email: "test@test.com", password: "12345678" } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn((data) => data) };
    next = jest.fn();
    authService.create = jest.fn(async (data) => data);
  });
  test("Signup new User", async () => {
    authService.isUserExist = jest.fn(async () => false);
    await userService.registration(req, res, next);
    expect(authService.isUserExist).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpCode.CREATED);
  });
  test("Signup already exist User", async () => {
    authService.isUserExist = jest.fn(async () => true);
    await userService.registration(req, res, next);
    expect(authService.isUserExist).toHaveBeenCalledWith(req.body.email);
    expect(res.status).toHaveBeenCalledWith(HttpCode.CONFLICT);
  });
  test("Signup with error database", async () => {
    const testError = new Error("Database error");
    authService.isUserExist = jest.fn(async () => {
      throw testError;
    });
    await userService.registration(req, res, next);
    expect(authService.isUserExist).toHaveBeenCalledWith(req.body.email);
    expect(next).toHaveBeenCalledWith(testError);
  });
});
