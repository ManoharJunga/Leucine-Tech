import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { Request as AccessRequest } from "../entities/Request";
import { User } from "../entities/User";
import { Software } from "../entities/Software";

const requestRepo = AppDataSource.getRepository(AccessRequest);
const userRepo = AppDataSource.getRepository(User);
const softwareRepo = AppDataSource.getRepository(Software);

// POST: Create request
export const createRequest = async (req: Request, res: Response) => {
  const { userId, softwareId, accessType, reason } = req.body;

  if (!userId || !softwareId || !accessType || !reason)
    return res.status(400).json({ message: "All fields are required" });

  const validTypes = ["Read", "Write", "Admin"];
  if (!validTypes.includes(accessType))
    return res.status(400).json({ message: "Invalid access type" });

  try {
    const user = await userRepo.findOneBy({ id: userId });
    const software = await softwareRepo.findOneBy({ id: softwareId });
    if (!user || !software)
      return res.status(404).json({ message: "User or software not found" });

    const newRequest = requestRepo.create({
      user,
      software,
      accessType,
      reason,
      status: "Pending",
    });

    await requestRepo.save(newRequest);
    return res.status(201).json({ message: "Request submitted", request: newRequest });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET all requests
export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await requestRepo.find();
    return res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET request by ID
export const getRequestById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const request = await requestRepo.findOneBy({ id: parseInt(id) });
    if (!request) return res.status(404).json({ message: "Request not found" });
    return res.status(200).json(request);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT: Update request status
export const updateRequestStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Pending", "Approved", "Rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  try {
    const request = await requestRepo.findOneBy({ id: parseInt(id) });
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await requestRepo.save(request);

    return res.status(200).json({ message: "Status updated", request });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE request
export const deleteRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const request = await requestRepo.findOneBy({ id: parseInt(id) });
    if (!request) return res.status(404).json({ message: "Request not found" });

    await requestRepo.remove(request);
    return res.status(200).json({ message: "Request deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
