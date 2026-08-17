import express from "express";
import {
  solveQuestion,
} from "../controllers/questionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/solve",
  authMiddleware,
  solveQuestion
);

export default router;