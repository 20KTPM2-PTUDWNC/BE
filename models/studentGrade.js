import mongoose from 'mongoose';

const Mark = {
    Private: 0,
    Public: 1
}

const studentGradeSchema = new mongoose.Schema({
    mark: {
        type: Number,
        default: Mark.Private,
        required: true
    },
    studentId: {
        type: Number,
        required: true
    },
    assignmentId:{
        type: mongoose.Types.ObjectId,
        ref: "Assignment"
    },
    grade: {
        type: Number,
        default: null
    },
    filePath: {
        type: String,
        required: null
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

export default mongoose.model('StudentGrade', studentGradeSchema, 'studentgrade');