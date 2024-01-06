import mongoose from 'mongoose';

const assignmentReviewSchema = new mongoose.Schema({
    studentGradeId: {
        type: mongoose.Types.ObjectId,
        ref: "StudentGrade",
        required: true,
    },
    expectedGrade:{
        type: Number,
        default: null
    },
    finalDecision:{
        type: Number,
        default: 0
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

export default mongoose.model('AssignmentReview', assignmentReviewSchema, 'assignmentreview');