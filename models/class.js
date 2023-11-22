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
    subject:{
        type: String,
    },
    room:{
        type: String,
    },
    studentList:{
        type: Array,
        default: []
    },
    gradeStructures:{
        type: Array,
        default: []
    },
},
    { timestamps: true });

export default mongoose.model('Class', classesSchema, 'class');