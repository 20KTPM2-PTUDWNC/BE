import mongoose from 'mongoose';

export const UserFlag = {
    Admin: 0,
    User: 1
}

const usersSchema = new mongoose.Schema({
    userFlag: {
        type: Number,
        default: UserFlag.User,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: null
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    name: {
        type: String,
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
    deletedAt: {
        type: Date,
        default: null
    },
    avatar:{
        type: String
    },
    typeLogin:{
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    studentId: {
        type: Number,
        default: null,
    },
},
    { timestamps: true });

export default mongoose.model('Users', usersSchema, 'users');