// src/routes/authRoute.ts
import express, { Request, Response, NextFunction } from "express";
import { signup, login } from "../controllers/authController";

const router = express.Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware to inject role into request body
const withRole = (role: "Admin" | "Manager" | "Employee") => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body.role = role;
    next();
  };
};

router.post("/signup", asyncHandler(signup));
router.post("/signup/admin", withRole("Admin"), asyncHandler(signup));
router.post("/signup/manager", withRole("Manager"), asyncHandler(signup));
router.post("/login", asyncHandler(login));

export default router;
