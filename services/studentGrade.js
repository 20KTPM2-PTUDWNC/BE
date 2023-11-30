import studentGradeModel from "../models/studentGrade.js";

export default {
    save: async (studentGrade) => {
      return await studentGradeModel.create(studentGrade);
    },
    findAll: async (id) => {
      const studentGrade = await studentGradeModel.findById(id);
      return studentGrade;
    },
    findGradeAnAssignment: async (assignmentId) => {
        const projection = { _id: 0, studentId: 1, grade: 1 };
        const grades = await studentGradeModel.find({ assignmentId }, projection);
        return grades;
    } 
  }