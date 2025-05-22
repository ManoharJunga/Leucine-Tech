// controllers/userController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { User } from "../entities/User";

const userRepo = AppDataSource.getRepository(User);

export const getEmployees = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const employees = await userRepo.find({ where: { role: "Employee" } });
    return res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getManagers = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const managers = await userRepo.find({ where: { role: "Manager" } });
    return res.status(200).json(managers);
  } catch (error) {
    console.error("Error fetching managers:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAdmins = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const admins = await userRepo.find({ where: { role: "Admin" } });
    return res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
