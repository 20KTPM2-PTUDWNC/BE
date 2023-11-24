import { ObjectId } from 'bson';
import mongoose from 'mongoose';

const UserRole = {
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
        ref: "Users"
    },
    classId:{
        type: mongoose.Types.ObjectId,
        ref: "Class"
    }
},
    { timestamps: true });

export default mongoose.model('UserClass', userClassSchema, 'userclass');