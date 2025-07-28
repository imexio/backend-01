import Job from "../models/job";
import Worker from "../models/worker";

class JobService {
    static async getAllJobs(filters) {
        return await Job.findAll(filters);
    }

    static async getJobById(id) {
        const job = await Job.findById(id);
        if (!job) {
            throw new Error("Job not found");
        }
        return job;
    }

    static async createJob(jobData) {
        const job = new Job(jobData);
        return await job.save();
    }

    static async assignJobToWorker(jobId, workerId, clientId) {
        const job = await Job.findById(jobId);
        if (!job) {
            throw new Error("Job not found");
        }

        if (job.clientId !== clientId) {
            throw new Error("Not authorized to assign this job");
        }

        if (job.status !== "open") {
            throw new Error("Job is not available for assignment");
        }

        await Job.assignWorker(jobId, workerId);
        await Worker.incrementJobCount(workerId);

        return { message: "Job assigned successfully" };
    }

    static async getClientJobs(clientId) {
        return await Job.findByClient(clientId);
    }

    static async getWorkerJobs(workerId) {
        return await Job.findByWorker(workerId);
    }

    static async completeJob(jobId) {
        await Job.complete(jobId);
    }
}

module.exports = JobService;
