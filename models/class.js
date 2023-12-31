import { ObjectId } from 'bson';
import mongoose, { Schema } from 'mongoose';
import Grade from "../models/grade.js";

const classesSchema = new mongoose.Schema({
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
    status: {
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

export default mongoose.model('Class', classesSchema, 'class');
