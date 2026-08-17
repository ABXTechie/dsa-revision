import express from "express";
import {
  getTodayRevisions,
  completeRevision,
  forgotRevision,
} from "../controllers/revisionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/today",
  authMiddleware,
  getTodayRevisions
);

router.post(
  "/:id/complete",
  authMiddleware,
  completeRevision
);

router.post(
  "/:id/forgot",
  authMiddleware,
  forgotRevision
);

export default router;