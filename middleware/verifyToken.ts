import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Models
import User from "../models/user";

export const verifyToken = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const bearerHeader = request.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    request.body.token = bearerToken;
    try {
      const user = await verifyJWT(request.body.token);
      if (!user) {
        return response.json({
          msg: "Account disabled or deleted",
          error: true,
        });
      }
      request.body.authUser = user;
      next();
    } catch (error) {
      response.json({ msg: "Invalid JWT or expired JWT token", error });
    }
  } else {
    response.status(403).json({ msg: "JWT token required", error: true });
  }
};

const verifyJWT = (token: string) => {
  let user = jwt.verify(token, "secret");
  return auth(user);
};

const auth = async (user: any) => {
  return await User.findById(user.id);
};

export default verifyToken;
