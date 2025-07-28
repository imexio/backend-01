import Worker from "../models/worker";
import Review from "../models/review";

class WorkerService {
    static async getAllWorkers(filters) {
        return await Worker.findAll(filters);
    }

    static async getWorkerById(id) {
        const worker = await Worker.findById(id);
        if (!worker) {
            throw new Error("Worker not found");
        }

        // Get reviews for this worker
        const reviews = await Review.findByWorker(id);
        return { ...worker, reviews };
    }

    static async createOrUpdateWorker(userData) {
        const worker = new Worker(userData);
        return await worker.save();
    }

    static async getWorkerByUid(uid) {
        return await Worker.findByUid(uid);
    }

    static async updateWorkerRating(workerId, rating) {
        await Worker.updateRating(workerId, rating);
    }

    static async incrementWorkerJobCount(workerId) {
        await Worker.incrementJobCount(workerId);
    }
}

module.exports = WorkerService;
