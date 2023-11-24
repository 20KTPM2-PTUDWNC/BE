import { ObjectId } from 'bson';
import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
    id:{
        type: mongoose.Types.ObjectId,
        require: true
    },
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
    }
},
    { timestamps: true });

export default mongoose.model('Grade', gradeSchema, 'grade');