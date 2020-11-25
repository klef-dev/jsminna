import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/login", (request: Request, response: Response) => {
  return response.json({ msg: "Login" });
});

export default router;
