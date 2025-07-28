import express from "express";
import ReviewController from "../controllers/reviewController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// All routes are protected
router.post("/", verifyToken, ReviewController.createReview);
router.get("/worker/:workerId", verifyToken, ReviewController.getWorkerReviews);
router.get("/my/reviews", verifyToken, ReviewController.getMyReviews);

module.exports = router;
