import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import revisionRoutes from "./routes/revisionRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
  })
);

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "DSA Revision API running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/revisions", revisionRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});