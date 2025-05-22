import express, { Request, Response, NextFunction } from "express";
import {
  getEmployees,
  getManagers,
  getAdmins,
} from "../controllers/userController";

const router = express.Router();

// asyncHandler to catch errors in async route handlers
const asyncHandler = (fn: Function) => 
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Role-based user routes
router.get("/employees", asyncHandler(getEmployees));
router.get("/managers", asyncHandler(getManagers));
router.get("/admins", asyncHandler(getAdmins));

export default router;
