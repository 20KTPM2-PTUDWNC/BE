import studentGradeModel from "../models/studentGrade.js";
import UserClassModel, { UserRole } from "../models/userClass.js";

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
  },
  updateStudentGrade: async (data) => {
    return await studentGradeModel.findOneAndUpdate({ assignmentId: data.assignmentId, studentId: data.studentId }, data, { upsert: true, new: true });
  },
  findStudentGrade: async (assignmentId, user) => {
    const userClass = await UserClassModel.findOne({ userId: user._id })
    if (userClass.userRole === UserRole.Student) {
      return await studentGradeModel.findOne({ assignmentId, studentId: user.studentId, mark: 1 });
    } else {
      return await studentGradeModel.findOne({ assignmentId, studentId: user.studentId });
    }
  }
}