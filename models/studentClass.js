import mongoose from 'mongoose';

const studentClassSchema = new mongoose.Schema({
    classId:{
        type: mongoose.Types.ObjectId,
        ref: "Class",
        required: true,
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref: "Users",
    },
    studentId: {
        type: Number,
        default: null,
    },
    name: {
        type: String,
        required: true,
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

export default mongoose.model('StudentClass', studentClassSchema, 'studentclass');