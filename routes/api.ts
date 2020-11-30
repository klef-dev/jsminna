import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Models
import User from "../models/user";
// Middleware
import { verifyToken } from "../middleware/verifyToken";

const router: Router = Router();

router.post("/signup", async (request: Request, response: Response) => {
  const {
    name,
    email,
    password,
    confirm_password,
    phone,
    gender,
  } = request.body;

  if (!name) {
    return response.json({ msg: "Name field required", error: true });
  }
  if (!email) {
    return response.json({ msg: "Email field required", error: true });
  }
  if (!password) {
    return response.json({ msg: "Password field required", error: true });
  }
  if (confirm_password != password) {
    return response.json({ msg: "Password mismatch", error: true });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return response.json({
        msg: "Email address already in use",
        error: true,
      });
    }
  } catch (error) {
    return response.json({ msg: "DB error", error: true });
  }

  try {
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      phone,
      gender,
    });

    const token = jwt.sign(
      {
        _id: user._id,
        email,
      },
      "secret",
      {
        expiresIn: "1h",
      }
    );

    return response.json({ name, email, phone, gender, token });
  } catch (error) {
    return response.json({ msg: "Couldn't create user", error: true });
  }
});

router.post("/login", async (request: Request, response: Response) => {
  let { email, password } = request.body;
  let errors = [];
  if (!email) {
    errors.push({
      text: "Please provide your email",
      field: "email",
    });
  }
  if (!password) {
    errors.push({
      text: "Enter your password",
      field: "password",
    });
  }
  if (errors.length > 0) {
    return response.json({
      errors,
      email,
      password,
    });
  }
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return response.json({
        msg: "Incorrect Username or password",
        error: true,
      });
    }
    const match = await bcrypt.compare(password, findUser.password);
    if (match) {
      const user = {
        id: findUser.id,
        email,
      };
      const token = jwt.sign(user, "secret", {
        expiresIn: "1h",
      });
      response.json({ token });
    } else {
      response.json({
        msg: "Incorrect Username or password",
        error: true,
      });
    }
  } catch (error) {
    response.json({ msg: "Database error", error: true });
  }
});

// Suggest
router.get("/suggest", verifyToken, (request: Request, response: Response) => {
  const { authUser } = request.body;
  response.json({ authUser });
});

export default router;
