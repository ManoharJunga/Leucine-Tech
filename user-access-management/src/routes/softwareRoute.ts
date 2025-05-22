import express, { Request, Response, NextFunction } from "express";
import {
  addSoftware,
  getAllSoftware,
  getSoftwareById,
  updateSoftware,
  deleteSoftware,
} from "../controllers/softwareController";

const router = express.Router();

// asyncHandler wrapper to catch errors in async route handlers
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// CRUD routes wrapped with asyncHandler

router.post("/", asyncHandler(addSoftware));
router.get("/", asyncHandler(getAllSoftware));
router.get("/:id", asyncHandler(getSoftwareById));
router.put("/:id", asyncHandler(updateSoftware));
router.delete("/:id", asyncHandler(deleteSoftware));

export default router;
