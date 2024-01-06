import mongoose from 'mongoose';

export const UserRole = {
    Student: 0,
    Teacher: 1
}

const userClassSchema = new mongoose.Schema({
    userRole: {
        type: Number,
        default: UserRole.Student,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    classId:{
        type: mongoose.Types.ObjectId,
        ref: "Class",
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

export default mongoose.model('UserClass', userClassSchema, 'userclass');