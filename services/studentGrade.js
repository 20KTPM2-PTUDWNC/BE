import AssignmentReviewModel from "../models/assignmentReview.js";
import UserReviewModel from "../models/userReview.js";
import StudentGradeModel from "../models/studentGrade.js";
import UserClassModel, { UserRole } from "../models/userClass.js";
import * as _ from 'lodash';

export default {
  save: async (studentGrade) => {
    return await StudentGradeModel.create(studentGrade);
  },
  findAll: async (id) => {
    const studentGrade = await StudentGradeModel.findById(id);
    return studentGrade;
  },
  findGradeAnAssignment: async (assignmentId) => {
    const projection = { _id: 0, studentId: 1, grade: 1 };
    const grades = await StudentGradeModel.find({ assignmentId }, projection);
    return grades;
  },
  updateStudentGrade: async (data) => {
    return await StudentGradeModel.findOneAndUpdate({ assignmentId: data.assignmentId, studentId: data.studentId }, data, { upsert: true, new: true });
  },
  findStudentGrade: async (assignmentId, user) => {
    const userClass = await UserClassModel.findOne({ userId: user._id });

    let conditions = { assignmentId, studentId: user.studentId };

    if (userClass.userRole === UserRole.Student) {
      conditions = { ...conditions, mark: 1 };
    }

    const studentGrade = await StudentGradeModel.findOne({ assignmentId, studentId: user.studentId });

    if (studentGrade) {
      const assignmentReview = await AssignmentReviewModel.findOne({ studentGradeId: studentGrade.id });

      const projection = { _id: 1, studentId: 1, name: 1 };

      let result = {
        ...studentGrade._doc,
        assignmentReview: null,
        userReview: []
      }

      if(assignmentReview) {
        const userReview = await UserReviewModel.find({ assignmentReviewId: assignmentReview.id }).populate('userId', projection).sort({ "sort": 1 });
        result = {
          ...result,
          assignmentReview: assignmentReview._doc,
          userReview: userReview.map(d => ({ ...d._doc }))
        }
      }

      return result;
    }

    return;
  }
}