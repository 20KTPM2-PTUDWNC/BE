import grade from "../models/grade.js";
import GradeModel from "../models/grade.js";

export default {
    save: async (newGrade) => {
      await GradeModel.create(newGrade);
    },
    findGradeByName: async (name) => {
      return await GradeModel.findOne({name});
    },
    findGradeById: async (id) => {
      const grade = await GradeModel.findById(id);
      return grade;
    },
    findAllGrades: async () => {
      return await GradeModel.find();
    },
    deleteGrade: async (gradeDelete) => {
      await GradeModel.deleteOne(gradeDelete);
    }
  }