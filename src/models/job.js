import { db, admin } from "../config/firebase";

class Job {
    constructor(data) {
        this.clientId = data.clientId;
        this.clientEmail = data.clientEmail;
        this.title = data.title;
        this.description = data.description;
        this.profession = data.profession;
        this.location = data.location;
        this.budget = data.budget;
        this.urgency = data.urgency || "medium";
        this.requirements = data.requirements || [];
        this.status = data.status || "open";
        this.assignedWorkerId = data.assignedWorkerId || null;
        this.createdAt = data.createdAt;
        this.assignedAt = data.assignedAt;
        this.completedAt = data.completedAt;
    }

    static getCollection() {
        return db.collection("jobs");
    }

    static async findById(id) {
        const doc = await this.getCollection().doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }

    static async findAll(filters = {}) {
        let query = this.getCollection();

        if (filters.profession) {
            query = query.where("profession", "==", filters.profession);
        }
        if (filters.location) {
            query = query.where("location", "==", filters.location);
        }
        if (filters.status) {
            query = query.where("status", "==", filters.status);
        } else {
            query = query.where("status", "==", "open");
        }

        const snapshot = await query.orderBy("createdAt", "desc").get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    static async findByClient(clientId) {
        const snapshot = await this.getCollection()
            .where("clientId", "==", clientId)
            .orderBy("createdAt", "desc")
            .get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    static async findByWorker(workerId) {
        const snapshot = await this.getCollection()
            .where("assignedWorkerId", "==", workerId)
            .orderBy("createdAt", "desc")
            .get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    async save() {
        const jobData = {
            clientId: this.clientId,
            clientEmail: this.clientEmail,
            title: this.title,
            description: this.description,
            profession: this.profession,
            location: this.location,
            budget: parseFloat(this.budget),
            urgency: this.urgency,
            requirements: this.requirements,
            status: this.status,
            assignedWorkerId: this.assignedWorkerId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await Job.getCollection().add(jobData);
        return { id: docRef.id, ...jobData };
    }

    static async assignWorker(jobId, workerId) {
        const jobRef = this.getCollection().doc(jobId);
        await jobRef.update({
            assignedWorkerId: workerId,
            status: "assigned",
            assignedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }

    static async complete(jobId) {
        const jobRef = this.getCollection().doc(jobId);
        await jobRef.update({
            status: "completed",
            completedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
}

module.exports = Job;
