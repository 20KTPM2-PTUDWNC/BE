import classesService from "../services/class.js";
import usersService from "../services/users.js";
import gradeService from "../services/grade.js";
import mongoose from "mongoose";

const createClass = async(req, res, next) => {
    const {name, subject, room} = req.body;
    const authorId = req.user._id;
    const generateCode = Math.random().toString(20).substr(2, 6);

    if (!name || !subject || !room) {
        return res.status(400).json({message: 'Invalid Class'});
    }

    const newClass = {...req.body, authorId: authorId, code: generateCode};

    await classesService.save(newClass);

    res.status(200).json({message: "Create new class successfully"});

}

const getAllClass = async(req, res, next) => {
    const classes = await classesService.findAllClasses();

    if (classes){
        return res.status(200).json(classes);
    }
    else{
        res.status(400).json({message: "No class"});
    }
}

const showClassDetail = async(req, res, next) => {
    const classId = req.params.id;
    const _class = await classesService.findClassById(classId);

    if (_class){
        return res.status(200).json(_class);
    }
    else{
        res.status(400).json({message: `No class with id: ${classId} `});
    }
}

const showMemberList = async(req, res, next) => {
    const classId = req.params.id;
    const _class = await classesService.findClassById(classId);

    if (_class) {
        // Fetch the teacher details from the users service
        const teacher = await usersService.findUserById(_class.authorId);
        
        // Fetch the student details from the users service
        const students = await Promise.all(_class.studentList.map(studentId =>
            usersService.findUserById(studentId)
        ));

        const memberList = {
            teacher: teacher,
            students: students
        };

        return res.status(200).json(memberList);
    } else {
        res.status(400).json({ message: `No class with id: ${classId}` });
    }
}

const addGradeComposition  = async (req, res, next) => {
    const classId = req.params.id;
    const { name, gradeScale } = req.body;
  
    if (!name || !gradeScale) {
      return res.status(400).json({ message: 'Invalid Grade Structure' });
    }
  
    const _class = await classesService.findClassById(classId);
  
    if (_class) {
        const gradeCompositionId = new mongoose.Types.ObjectId();
        // Create the new grade structure object
        const newGradeComposition = {
            id: gradeCompositionId,
            name: name,
            gradeScale: gradeScale
    };
  
      // Add the new grade structure to the class
      _class.gradeStructures.push(newGradeComposition);
      
      // Save the updated class in the database
      await _class.save();
  
      return res.status(200).json({ message: "Grade structure added successfully" });
    } else {
      res.status(400).json({ message: `No class with id: ${classId}` });
    }
}

const showGradeStructure = async(req, res, next) =>{
    const classId = req.params.id;
    const _class = await classesService.findClassById(classId);

    if (_class){

        return res.status(200).json(_class.gradeStructures);
    }
    else {
        res.status(400).json({ message: `No class with id: ${classId}` });
      }
}

const updateGradeComposition = async (req, res, next) => {
    const classId = req.params.classId;
    const gradeCompositionId = req.params.gradeCompositionId;
    const {name, gradeScale } = req.body;
    console.log(name);
    console.log(gradeScale);
    if (!name || !gradeScale) {
        return res.status(400).json({ message: 'Invalid Grade Structure' });
    }

    const _class = await classesService.findClassById(classId);
    
    if (_class) {
        // Find the grade composition to update
        const gradeCompositionIndex = _class.gradeStructures.findIndex(grade => String(grade.id) === gradeCompositionId);

        if (gradeCompositionIndex !== -1) {
            // Update the grade composition properties
            _class.gradeStructures[gradeCompositionIndex].name = name;
            _class.gradeStructures[gradeCompositionIndex].gradeScale = gradeScale;

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

const deleteGradeComposition = async (req, res, next) => {
    const classId = req.params.classId;
    const gradeCompositionId = req.params.gradeCompositionId;
    
    const _class = await classesService.findClassById(classId);
  
    if (_class) {
      // Find the index of the grade composition to remove
      const gradeCompositionIndex = _class.gradeStructures.find(grade => String(grade.id) === gradeCompositionId);
      
      if (gradeCompositionIndex) {
        // Remove the grade composition from the array
        _class.gradeStructures.splice(gradeCompositionIndex, 1);
  
        // Save the updated class in the database
        await _class.save();
  
        return res.status(200).json({ message: 'Grade structure removed successfully' });
      } 
      else {
        return res.status(400).json({ message: `No grade composition with id: ${gradeCompositionId}` });
      }
    } else {
      return res.status(400).json({ message: `No class with id: ${classId}` });
    }
}

export {createClass, getAllClass, showClassDetail, showMemberList, 
    addGradeComposition, showGradeStructure, updateGradeComposition,deleteGradeComposition};