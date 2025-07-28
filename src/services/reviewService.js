import Review from "../models/review";
import Job from "../models/job";
import WorkerService from "./workerService";

class ReviewService {
    static async createReview(reviewData) {
        const review = new Review(reviewData);
        const savedReview = await review.save();

        // Update worker's rating
        const updatedRating = await Review.calculateWorkerRating(
            reviewData.workerId
        );
        await WorkerService.updateWorkerRating(
            reviewData.workerId,
            updatedRating
        );

        // Complete the job if jobId is provided
        if (reviewData.jobId) {
            await Job.complete(reviewData.jobId);
        }

        return savedReview;
    }

    static async getWorkerReviews(workerId) {
        return await Review.findByWorker(workerId);
    }

    static async getClientReviews(clientId) {
        return await Review.findByClient(clientId);
    }
}

module.exports = ReviewService;
