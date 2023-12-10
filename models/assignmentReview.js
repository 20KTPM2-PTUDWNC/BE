import mongoose from 'mongoose';

const assignmentReviewSchema = new mongoose.Schema({
    studentGradeId: {
        type: mongoose.Types.ObjectId,
        ref: "StudentGrade",
        required: true,
    },
    classId:{
        type: mongoose.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    expectedGrade:{
        type: Number,
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

export default mongoose.model('AssignmentReview', assignmentReviewSchema, 'assignmentreview');