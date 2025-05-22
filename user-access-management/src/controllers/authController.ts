import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { User, UserRole } from "../entities/User";
import { hashPassword, comparePasswords } from "../utils/hash";
import jwt from "jsonwebtoken";

const userRepo = AppDataSource.getRepository(User);
// controllers/authController.ts
export const signup = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log("Signup request received:", req.body);

    const { username, password, role = "Employee" } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const allowedRoles: UserRole[] = ["Employee", "Manager", "Admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    const existingUser = await userRepo.findOneBy({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const user = userRepo.create({ username, password: hashedPassword, role });
    await userRepo.save(user);

    return res.status(201).json({ message: `${role} account created successfully` });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log("Login request received:", req.body);

    const { username, password } = req.body;

    const user = await userRepo.findOneBy({ username });
    if (!user) {
      console.log(`Login failed: User "${username}" not found`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      console.log(`Login failed: Password mismatch for user "${username}"`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    console.log(`Login successful for user "${username}"`);

    return res.json({
      token,
      id: user.id,             // ✅ Include user ID
      username: user.username, // ✅ Include username
      role: user.role
    });
      } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
