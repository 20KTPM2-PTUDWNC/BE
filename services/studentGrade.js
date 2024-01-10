import AssignmentReviewModel from "../models/assignmentReview.js";
import UserReviewModel from "../models/userReview.js";
import StudentGradeModel from "../models/studentGrade.js";
import UserClassModel, { UserRole } from "../models/userClass.js";
import UsersModel from "../models/users.js";
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
    const projection = { _id: 0, studentId: 1, grade: 1, mark: 1 };
    const grades = await StudentGradeModel.find({ assignmentId }, projection).populate('userId', '_id name');
    
    const formattedGrades = grades.map((grade) => ({
      studentId: grade.studentId,
      grade: grade.grade,
      mark: grade.mark,
      userId: grade.userId._id, // Accessing the _id directly from the userId field
      name: grade.userId.name
  }));

  return formattedGrades;
  },
  updateStudentGrade: async (data) => {
    return await StudentGradeModel.findOneAndUpdate({ assignmentId: data.assignmentId, userId: data.userId }, data, { upsert: true, new: true });
  },
  findStudentGrade: async (assignmentId, userId) => {
    const studentGrade = await StudentGradeModel.findOne({ assignmentId, userId });

    if (studentGrade) {
      const assignmentReview = await AssignmentReviewModel.findOne({ studentGradeId: studentGrade.id });

      const projection = { _id: 1, studentId: 1, name: 1 };

      let result = {
        ...studentGrade._doc,
        assignmentReview: null,
        userReview: []
      }

      if (assignmentReview) {
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
  },
  findAllStudentInClass: async (classId) => {
    const projection = { _id: 0, studentId: 1, name: 1 };
    return await UserClassModel.find({ classId, userRole: 0 }, { _id: 1 }).populate('userId', projection);
  }
}