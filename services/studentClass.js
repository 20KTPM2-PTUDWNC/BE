import StudentClassModel from "../models/studentClass.js";

export default {
    save: async (newStudent) => {
      return await StudentClassModel.create(newStudent);
    },
    findAllStudentInClass: async (classId) => {
    const projection = { _id: 0, studentId: 1, name: 1 };
      return await StudentClassModel.find({ classId }, projection);
    },
    findByStudentIdAndClassId: async (studentId, classId) => {
      const existingStudent = await StudentClassModel.findOne({
        studentId: studentId,
        classId: classId,
      });
      return existingStudent;
    }
  }