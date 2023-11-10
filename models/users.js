import mongoose from 'mongoose';

const UserFlag = {
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
        required: true
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
    deleteAt: {
        type: Date,
        default: null
    },
    avatar:{
        type: String
    }
},
    { timestamps: true });

export default mongoose.model('Users', usersSchema, 'users');