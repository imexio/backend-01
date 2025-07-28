import JobService from "../services/jobService";
import WorkerService from "../services/workerService";

class JobController {
    static async getAllJobs(req, res) {
        try {
            const { profession, location, status } = req.query;
            const filters = { profession, location, status };

            const jobs = await JobService.getAllJobs(filters);
            res.json(jobs);
        } catch (error) {
            console.error("Get jobs error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getJobById(req, res) {
        try {
            const job = await JobService.getJobById(req.params.id);
            res.json(job);
        } catch (error) {
            console.error("Get job error:", error);
            if (error.message === "Job not found") {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    static async createJob(req, res) {
        try {
            const jobData = {
                clientId: req.user.uid,
                clientEmail: req.user.email,
                ...req.body,
            };

            const job = await JobService.createJob(jobData);
            res.json(job);
        } catch (error) {
            console.error("Create job error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    static async assignJob(req, res) {
        try {
            const { workerId } = req.body;
            const jobId = req.params.jobId;
            const clientId = req.user.uid;

            const result = await JobService.assignJobToWorker(
                jobId,
                workerId,
                clientId
            );
            res.json(result);
        } catch (error) {
            console.error("Assign job error:", error);
            if (
                error.message.includes("not found") ||
                error.message.includes("Not authorized")
            ) {
                res.status(404).json({ error: error.message });
            } else if (error.message.includes("not available")) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    static async getMyJobs(req, res) {
        try {
            const { role } = req.query;
            let jobs = [];

            if (role === "client") {
                jobs = await JobService.getClientJobs(req.user.uid);
            } else if (role === "worker") {
                // Get worker's ID first
                const worker = await WorkerService.getWorkerByUid(req.user.uid);
                if (worker) {
                    jobs = await JobService.getWorkerJobs(worker.id);
                }
            }

            res.json(jobs);
        } catch (error) {
            console.error("Get my jobs error:", error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = JobController;
