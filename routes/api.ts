import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Models
import User from "../models/user";

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

router.get("/login", (request: Request, response: Response) => {
  return response.json({ msg: "Login" });
});

export default router;
