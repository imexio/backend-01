import ReviewService from "../services/reviewService";

class ReviewController {
    static async createReview(req, res) {
        try {
            const reviewData = {
                clientId: req.user.uid,
                clientEmail: req.user.email,
                ...req.body,
            };

            const review = await ReviewService.createReview(reviewData);
            res.json({ message: "Review added successfully", review });
        } catch (error) {
            console.error("Create review error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getWorkerReviews(req, res) {
        try {
            const reviews = await ReviewService.getWorkerReviews(
                req.params.workerId
            );
            res.json(reviews);
        } catch (error) {
            console.error("Get worker reviews error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getMyReviews(req, res) {
        try {
            const reviews = await ReviewService.getClientReviews(req.user.uid);
            res.json(reviews);
        } catch (error) {
            console.error("Get my reviews error:", error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ReviewController;
