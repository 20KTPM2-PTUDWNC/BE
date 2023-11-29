import classesService from "../services/class.js";
import gradeService from "../services/grade.js";
import AssignmentModel from "../models/assignment.js";

const addAssignment  = async (req, res, next) => {
    const gradeStructureId = req.params.gradeStructureId;
    const { name, scale } = req.body;
  
    if (!name || !scale) {
      return res.status(400).json({ message: 'Invalid Grade Structure' });
    }
  
    const gradeStructure = await gradeService.findGradeById(gradeStructureId);
  
    if (gradeStructure) {
        // Create the new assignment object
        const newAssignment = {
            name: name,
            scale: scale,
            gradeStructureId: gradeStructureId
    };
    
    // Save the updated class in the database
    await AssignmentModel.create(newAssignment);
  
      return res.status(200).json({ message: "Assignment added successfully" });
    } else {
      res.status(400).json({ message: `No class with id: ${gradeStructure}` });
    }
}

const showAssignmentList = async(req, res, next) =>{
    const gradeStructureId = req.params.gradeStructureId;
    const assignmentList = await AssignmentModel.find({gradeStructureId: gradeStructureId});

    if (assignmentList){
        return res.status(200).json(assignmentList);
    }
    else {
        res.status(400).json({ message: `No grade composition with id: ${gradeStructureId}` });
      }
}

export {addAssignment, showAssignmentList};