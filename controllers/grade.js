import classesService from "../services/class.js";
import usersService from "../services/users.js";
import gradeService from "../services/grade.js";
import GradeModel from "../models/grade.js";
import mongoose from "mongoose";

const addGradeComposition  = async (req, res, next) => {
    const classId = req.params.classId;
    const { name, gradeScale } = req.body;
  
    if (!name || !gradeScale) {
      return res.status(400).json({ message: 'Invalid Grade Structure' });
    }
  
    const _class = await classesService.findClassById(classId);
  
    if (_class) {
        // Create the new grade structure object
        const newGradeComposition = {
            name: name,
            gradeScale: gradeScale,
            classId: classId
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
    const { name, gradeScale, newPosition } = req.body;

    if (!name || !gradeScale || !newPosition) {
        return res.status(400).json({ message: 'Invalid Grade Structure' });
    }

    const _class = await classesService.findClassById(classId);

    if (_class) {
        // Find the grade composition to update
        const gradeCompositionIndex = _class.gradeStructures.findIndex(grade => String(grade.id) === gradeCompositionId);

        if (gradeCompositionIndex !== -1) {
            // Remove the grade composition from the current position
            const [removed] = _class.gradeStructures.splice(gradeCompositionIndex, 1);

            // Insert the grade composition at the new position
            _class.gradeStructures.splice(newPosition, 0, removed);

            // Update the grade composition properties
            _class.gradeStructures[newPosition].name = name;
            _class.gradeStructures[newPosition].gradeScale = gradeScale;

            // Save the updated class in the database
            await _class.save();

            return res.status(200).json({ message: 'Grade structure updated successfully' });
        } else {
            return res.status(400).json({ message: `No grade composition with id: ${gradeCompositionId}` });
        }
    } else {
        return res.status(400).json({ message: `No class with id: ${classId}` });
    }
}

export {addGradeComposition, showGradeStructure, updateGradeComposition, deleteGradeComposition};