import WorkerService from "../services/workerService";

class WorkerController {
    static async getAllWorkers(req, res) {
        try {
            const { profession, location, minRating } = req.query;
            const filters = { profession, location, minRating };

            const workers = await WorkerService.getAllWorkers(filters);
            res.json(workers);
        } catch (error) {
            console.error("Get workers error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getWorkerById(req, res) {
        try {
            const worker = await WorkerService.getWorkerById(req.params.id);
            res.json(worker);
        } catch (error) {
            console.error("Get worker error:", error);
            if (error.message === "Worker not found") {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    static async createOrUpdateWorker(req, res) {
        try {
            const workerData = {
                uid: req.user.uid,
                email: req.user.email,
                ...req.body,
            };

            const worker = await WorkerService.createOrUpdateWorker(workerData);
            res.json(worker);
        } catch (error) {
            console.error("Create/Update worker error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getMyProfile(req, res) {
        try {
            const worker = await WorkerService.getWorkerByUid(req.user.uid);
            if (!worker) {
                return res
                    .status(404)
                    .json({ error: "Worker profile not found" });
            }
            res.json(worker);
        } catch (error) {
            console.error("Get my profile error:", error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = WorkerController;
