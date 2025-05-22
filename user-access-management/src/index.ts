import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config";
import authRoutes from "./routes/authRoute";
import softwareRoutes from "./routes/softwareRoute";
import requestRoute from "./routes/requestRoute";
import userRoutes from "./routes/userRoutes";

import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});
app.post("/test", (req, res) => {
  console.log("Test route hit!");
  res.json({ message: "Test route works" });
});

app.use(cors({
  origin: "*",  // Allow all origins
}));

app.use(express.json());

// Initialize DB connection
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/software", softwareRoutes);
app.use("/api/requests", requestRoute);
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("User Access Management API");
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
