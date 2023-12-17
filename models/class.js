import { ObjectId } from 'bson';
import mongoose, { Schema } from 'mongoose';
import Grade from "../models/grade.js";

const ClassFlag = {
    Active: 0,
    Inactive: 1
}

const classesSchema = new mongoose.Schema({
    status: {
        type: Number,
        default: ClassFlag.Active,
        required: true
    },
    name: {
        type: String,
        require: true
    },
    code: {
        type: String,
        require: true
    },
    link: {
        type: String
    },
    authorId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    subject: {
        type: String,
    },
    room: {
        type: String,
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

export default mongoose.model('Class', classesSchema, 'class');