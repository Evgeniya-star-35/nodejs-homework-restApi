import express from "express";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import { HttpCode, LIMIT_JSON } from "./lib/constants";

import contactRouter from "./routes/contacts";
import {
  registrationRouter,
  loginRouter,
  logoutRouter,
  currentRouter,
  avatarRouter,
  roleRouter,
} from "./routes/users";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(helmet());
app.use(logger(formatsLogger));
app.use(express.static(process.env.FOLDER_FOR_AVATARS));
app.use(cors());
app.use(express.json({ limit: LIMIT_JSON })); // json
app.use((req, res, next) => {
  app.set("lang", req.acceptsLanguages(["en", "ru"]));
  next();
});

app.use("/users", registrationRouter);
app.use("/users", loginRouter);
app.use("/users", logoutRouter);
app.use("/users", currentRouter);
app.use("/users", avatarRouter);
app.use("/users", roleRouter);

app.use("/contacts", contactRouter.listContactsRouter);
app.use("/contacts", contactRouter.updateRouter);
app.use("/contacts", contactRouter.createRouter);
app.use("/contacts", contactRouter.deleteRouter);
app.use("/contacts", contactRouter.getByIdRouter);
app.use("/contacts", contactRouter.patchContactRouter);

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: "error", code: HttpCode.NOT_FOUND, message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
    status: "fail",
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: err.message,
  });
});
export default app;
