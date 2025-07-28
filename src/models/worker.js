import { db, admin } from "../config/firebase";

class Worker {
    constructor(data) {
        this.uid = data.uid;
        this.email = data.email;
        this.name = data.name;
        this.profession = data.profession;
        this.description = data.description;
        this.skills = data.skills || [];
        this.experience = data.experience;
        this.location = data.location;
        this.hourlyRate = data.hourlyRate;
        this.availability = data.availability || "available";
        this.phoneNumber = data.phoneNumber;
        this.profileImage = data.profileImage || "";
        this.averageRating = data.averageRating || 0;
        this.totalReviews = data.totalReviews || 0;
        this.totalJobs = data.totalJobs || 0;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    static getCollection() {
        return db.collection("workers");
    }

    static async findById(id) {
        const doc = await this.getCollection().doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }

    static async findByUid(uid) {
        const snapshot = await this.getCollection()
            .where("uid", "==", uid)
            .get();
        return snapshot.empty
            ? null
            : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }

    static async findAll(filters = {}) {
        let query = this.getCollection();

        if (filters.profession) {
            query = query.where("profession", "==", filters.profession);
        }
        if (filters.location) {
            query = query.where("location", "==", filters.location);
        }
        if (filters.minRating) {
            query = query.where(
                "averageRating",
                ">=",
                parseFloat(filters.minRating)
            );
        }

        const snapshot = await query.get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    async save() {
        const workerData = {
            uid: this.uid,
            email: this.email,
            name: this.name,
            profession: this.profession,
            description: this.description,
            skills: this.skills,
            experience: this.experience,
            location: this.location,
            hourlyRate: parseFloat(this.hourlyRate),
            availability: this.availability,
            phoneNumber: this.phoneNumber,
            profileImage: this.profileImage,
            averageRating: this.averageRating,
            totalReviews: this.totalReviews,
            totalJobs: this.totalJobs,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // Check if worker exists
        const existingWorker = await Worker.findByUid(this.uid);

        if (existingWorker) {
            // Update existing
            await Worker.getCollection()
                .doc(existingWorker.id)
                .update(workerData);
            return { id: existingWorker.id, ...workerData };
        } else {
            // Create new
            workerData.createdAt = admin.firestore.FieldValue.serverTimestamp();
            const docRef = await Worker.getCollection().add(workerData);
            return { id: docRef.id, ...workerData };
        }
    }

    static async updateRating(workerId, newRating) {
        const workerRef = this.getCollection().doc(workerId);
        await workerRef.update({
            averageRating: newRating.averageRating,
            totalReviews: newRating.totalReviews,
        });
    }

    static async incrementJobCount(workerId) {
        const workerRef = this.getCollection().doc(workerId);
        await workerRef.update({
            totalJobs: admin.firestore.FieldValue.increment(1),
        });
    }
}

module.exports = Worker;
