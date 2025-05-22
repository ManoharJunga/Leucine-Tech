// src/middleware/adminAuth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: string;
  };
}

export const adminAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Get token from headers (Authorization: Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Invalid token format" });
      return;
    }

    // Verify token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: "JWT secret not configured" });
      return;
    }

    const decoded = jwt.verify(token, secret) as { userId: number; username: string; role: string };

    // Attach user info to req for downstream
    req.user = decoded;

    // Check role
    if (req.user.role !== "Admin") {
      res.status(403).json({ message: "Forbidden: Admins only" });
      return;
    }

    next(); // all good, proceed

  } catch (error) {
    console.error("adminAuth error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
