import { db, admin } from "../config/firebase";

class Review {
    constructor(data) {
        this.workerId = data.workerId;
        this.jobId = data.jobId;
        this.clientId = data.clientId;
        this.clientEmail = data.clientEmail;
        this.rating = data.rating;
        this.comment = data.comment;
        this.createdAt = data.createdAt;
    }

    static getCollection() {
        return db.collection("reviews");
    }

    static async findByWorker(workerId) {
        const snapshot = await this.getCollection()
            .where("workerId", "==", workerId)
            .orderBy("createdAt", "desc")
            .get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    static async findByClient(clientId) {
        const snapshot = await this.getCollection()
            .where("clientId", "==", clientId)
            .orderBy("createdAt", "desc")
            .get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    async save() {
        const reviewData = {
            workerId: this.workerId,
            jobId: this.jobId,
            clientId: this.clientId,
            clientEmail: this.clientEmail,
            rating: parseInt(this.rating),
            comment: this.comment,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await Review.getCollection().add(reviewData);
        return { id: docRef.id, ...reviewData };
    }

    static async calculateWorkerRating(workerId) {
        const reviews = await this.findByWorker(workerId);

        if (reviews.length === 0) {
            return { averageRating: 0, totalReviews: 0 };
        }

        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );
        const averageRating =
            Math.round((totalRating / reviews.length) * 10) / 10;

        return {
            averageRating,
            totalReviews: reviews.length,
        };
    }
}

module.exports = Review;
