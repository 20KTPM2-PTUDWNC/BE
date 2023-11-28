import classesService from "../services/class.js";
import gradeService from "../services/grade.js";
import GradeModel from "../models/grade.js";

const addGradeComposition  = async (req, res, next) => {
    const classId = req.params.classId;
    const { name, gradeScale } = req.body;
  
    if (!name || !gradeScale) {
      return res.status(400).json({ message: 'Invalid Grade Structure' });
    }
  
    const _class = await classesService.findClassById(classId);
  
    if (_class) {
        const listGrade = await GradeModel.find({classId: classId});
        const countGrade = listGrade.length;
        const position = countGrade + 1;
        // Create the new grade structure object
        const newGradeComposition = {
            name: name,
            gradeScale: gradeScale,
            classId: classId,
            sort: position
    };
    
    // Save the updated class in the database
    await gradeService.save(newGradeComposition);
  
      return res.status(200).json({ message: "Grade structure added successfully" });
    } else {
      res.status(400).json({ message: `No class with id: ${classId}` });
    }
}

const showGradeStructure = async(req, res, next) =>{
    const classId = req.params.classId;
    const gradeComposition = await GradeModel.find({classId: classId});

    if (gradeComposition){
        return res.status(200).json(gradeComposition);
    }
    else {
        res.status(400).json({ message: `No class with id: ${classId}` });
      }
}

const updateGradeComposition = async (req, res, next) => {
    const classId = req.params.classId;
    const gradeCompositionId = req.params.gradeCompositionId;
    const {name, gradeScale } = req.body;
    
    if (!name || !gradeScale) {
        return res.status(400).json({ message: 'Invalid Grade Structure' });
    }

    const gradeComposition = await GradeModel.findOne({_id: gradeCompositionId, classId: classId});
    
    if (gradeComposition) {
        // Find the grade composition to update
        const updateGradeComposition = await GradeModel.findByIdAndUpdate({_id: gradeCompositionId, classId: classId}, {name: name, gradeScale: gradeScale});
            return res.status(200).json(updateGradeComposition);
        } 
    else {
        return res.status(400).json({ message: `No grade composition with id: ${gradeCompositionId}` });
    }
}

const deleteGradeComposition = async (req, res, next) => {
    const classId = req.params.classId;
    const gradeCompositionId = req.params.gradeCompositionId;
    
    const gradeComposition = await GradeModel.findOne({_id: gradeCompositionId, classId: classId});
  
    if (gradeComposition) {
        await GradeModel.findByIdAndDelete({_id: gradeCompositionId, classId: classId});
        return res.status(400).json({ message: `Delete grade composition with id: ${gradeCompositionId} successfully` });
    }
    else {
        return res.status(400).json({ message: `No grade composition with id: ${gradeCompositionId}` });
    }
}

const arrangeGradeComposition = async (req, res, next) => {
    const classId = req.params.classId;
    const gradeCompositionId = req.params.gradeCompositionId;
    const newPosition = req.params.position;

    const gradeComposition = await GradeModel.findOne({ _id: gradeCompositionId, classId: classId });
    const _class = await GradeModel.find({ classId: classId });

    if (gradeComposition) {
        const oldPosition = gradeComposition.sort;

        // Update the target grade composition's position
        await GradeModel.findByIdAndUpdate(
            { _id: gradeCompositionId, classId: classId },
            { sort: newPosition }
        );

        // Adjust positions of other grade compositions
        for (let i = 0; i < _class.length; i++) {
            if (_class[i]._id.toString() !== gradeCompositionId) {
                if (_class[i].sort > oldPosition && _class[i].sort <= newPosition) {
                    await GradeModel.findByIdAndUpdate(
                        { _id: _class[i]._id, classId: classId },
                        { sort: _class[i].sort - 1 }
                    );
                } else if (_class[i].sort < oldPosition && _class[i].sort >= newPosition) {
                    await GradeModel.findByIdAndUpdate(
                        { _id: _class[i]._id, classId: classId },
                        { sort: _class[i].sort + 1 }
                    );
                }
            }
        }

        return res.status(200).json({ message: 'Grade structure updated successfully' });
    } else {
        return res.status(400).json({ message: `No grade composition with id: ${gradeCompositionId}` });
    }
}



export {addGradeComposition, showGradeStructure, updateGradeComposition, deleteGradeComposition, arrangeGradeComposition};