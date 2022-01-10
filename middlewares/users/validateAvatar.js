import Joi from "joi";
import { HttpCode } from "../../lib/constants";

const schemaAddUser = Joi.object({
  email: Joi.string()
    .email(/\S+@\S+\.\S+/)
    .required(),
  password: Joi.string().min(6).max(20).required(),
  subscription: Joi.string().required(),
});

const schemaUpdateSub = Joi.object({
  subscription: Joi.string().required(),
});

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Field: ${message.replace(/"/g, "")}`,
    });
  }
  next();
};

export const addUser = (req, res, next) => {
  return validate(schemaAddUser, req.body, next);
};

export const updateSub = (req, res, next) => {
  return validate(schemaUpdateSub, req.body, next);
};

export const validateUploadAvatar = (req, res, next) => {
  if (!req.file) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      data: "Bad request",
      message: "Avatar is not found",
    });
  }
  next();
};
