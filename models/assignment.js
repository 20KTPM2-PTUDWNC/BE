import { ObjectId } from 'bson';
import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    scale: {
        type: Number,
        require: true
    },
    gradeStructureId:{
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "Grade"
    }
},
    { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema, 'assignment');