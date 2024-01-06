import mongoose from 'mongoose';

const userReviewSchema = new mongoose.Schema({
    assignmentReviewId: {
        type: mongoose.Types.ObjectId,
        ref: "AssignmentReview",
        required: true,
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    text:{
        type: String,
        default: null
    },
    sort:{
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

export default mongoose.model('UserReview', userReviewSchema, 'userreview');