import express from "express";
import JobController from "../controllers/jobController";
import { verifyToken, optionalAuth } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", optionalAuth, JobController.getAllJobs);
router.get("/:id", optionalAuth, JobController.getJobById);

// Protected routes
router.post("/", verifyToken, JobController.createJob);
router.post("/:jobId/assign", verifyToken, JobController.assignJob);
router.get("/my/jobs", verifyToken, JobController.getMyJobs);

module.exports = router;
