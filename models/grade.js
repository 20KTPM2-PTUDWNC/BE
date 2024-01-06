import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    gradeScale: {
        type: Number,
        require: true
    },
    classId:{
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "Class"
    },
    sort:{
        type: Number,
        require: true
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

export default mongoose.model('Grade', gradeSchema, 'grade');