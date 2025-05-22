import express, { Request, Response, NextFunction } from "express";
import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest,
} from "../controllers/requestController";

const router = express.Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post("/", asyncHandler(createRequest));
router.get("/", asyncHandler(getAllRequests));
router.get("/:id", asyncHandler(getRequestById));
router.put("/:id", asyncHandler(updateRequestStatus));
router.delete("/:id", asyncHandler(deleteRequest));

export default router;
