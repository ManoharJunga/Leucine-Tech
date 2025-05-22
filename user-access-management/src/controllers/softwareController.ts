import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { Software } from "../entities/Software";

const validAccessLevels = ["Read", "Write", "Admin"];

export const addSoftware = async (req: Request, res: Response) => {
  try {
    const { name, description, accessLevel } = req.body;

    if (!name || !accessLevel) {
      return res.status(400).json({ message: "Name and accessLevel are required" });
    }

    if (!validAccessLevels.includes(accessLevel)) {
      return res.status(400).json({ message: "Invalid access level" });
    }

    const softwareRepo = AppDataSource.getRepository(Software);
    const newSoftware = softwareRepo.create({ name, description, accessLevel });
    await softwareRepo.save(newSoftware);

    return res.status(201).json({ message: "Software added successfully", software: newSoftware });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllSoftware = async (req: Request, res: Response) => {
  try {
    const softwareRepo = AppDataSource.getRepository(Software);
    const allSoftware = await softwareRepo.find();
    return res.json(allSoftware);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSoftwareById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const softwareRepo = AppDataSource.getRepository(Software);

    const software = await softwareRepo.findOneBy({ id: parseInt(id) });
    if (!software) {
      return res.status(404).json({ message: "Software not found" });
    }
    return res.json(software);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateSoftware = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, accessLevel } = req.body;

    if (accessLevel && !validAccessLevels.includes(accessLevel)) {
      return res.status(400).json({ message: "Invalid access level" });
    }

    const softwareRepo = AppDataSource.getRepository(Software);

    const software = await softwareRepo.findOneBy({ id: parseInt(id) });
    if (!software) {
      return res.status(404).json({ message: "Software not found" });
    }

    software.name = name ?? software.name;
    software.description = description ?? software.description;
    software.accessLevel = accessLevel ?? software.accessLevel;

    await softwareRepo.save(software);
    return res.json({ message: "Software updated successfully", software });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteSoftware = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const softwareRepo = AppDataSource.getRepository(Software);

    const software = await softwareRepo.findOneBy({ id: parseInt(id) });
    if (!software) {
      return res.status(404).json({ message: "Software not found" });
    }

    await softwareRepo.remove(software);
    return res.json({ message: "Software deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
