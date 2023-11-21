import { ObjectId } from 'bson';
import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    gradeScale: {
        type: Number,
        require: true
    }
},
    { timestamps: true });

export default mongoose.model('Grade', classesSchema, 'grade');