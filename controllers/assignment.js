import AssignmentReviewModel from "../models/assignmentReview.js";
import gradeService from "../services/grade.js";
import AssignmentModel from "../models/assignment.js";
import assignmentReviewService from "../services/assignmentReview.js";

export const addAssignment = async (req, res, next) => {
  const gradeStructureId = req.params.gradeStructureId;
  const { name, scale } = req.body;

  if (!name || !scale) {
    return res.status(400).json({ message: 'Invalid Grade Structure' });
  }

  const gradeStructure = await gradeService.findGradeById(gradeStructureId);

  if (gradeStructure) {
    // Calculate the total scale of existing assignments
    const existingAssignments = await AssignmentModel.find({ gradeStructureId: gradeStructureId });
    const totalExistingScale = existingAssignments.reduce((total, assignment) => total + assignment.scale, 0);

    // Check if adding the new assignment would exceed the gradeScale limit
    if (totalExistingScale + scale > gradeStructure.gradeScale) {
      return res.status(400).json({ message: 'Total scale exceeds gradeScale limit' });
    }

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
    res.status(400).json({ message: `No grade structure with id: ${gradeStructure}` });
  }
};


export const showAssignmentList = async (req, res, next) => {
  const gradeStructureId = req.params.gradeStructureId;
  const assignmentList = await AssignmentModel.find({ gradeStructureId: gradeStructureId });

  if (assignmentList) {
    return res.status(200).json(assignmentList);
  }
  else {
    res.status(400).json({ message: `No grade composition with id: ${gradeStructureId}` });
  }
}

export const reviewAssignment = async (req, res, next) => {
  const studentGradeId = req.params.studentGradeId;
  const { expectedGrade, userReview } = req.body;

  if (studentGradeId) {
    await assignmentReviewService.updateAssignmentReview({ expectedGrade, userReview, studentGradeId });

    return res.status(200).json({ message: 'Successfully' });
  }

}