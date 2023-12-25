import mongoose from 'mongoose';

const studentIdReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    studentId: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    text: {
        type: String,
        default: null
    },
    sort: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    deleteAt: {
        type: Date,
        default: null
    }
},
    { timestamps: true });

export default mongoose.model('StudentIdReview', studentIdReviewSchema, 'studentidreview');