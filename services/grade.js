import GradeModel from "../models/grade.js";

export default {
    save: async (newGrade) => {
      await GradeModel.create(newGrade);
    },
    findClassByName: async (name) => {
      return await GradeModel.findOne({name});
    },
    findClassById: async (id) => {
      const grade = await GradeModel.findById(id);
      return grade;
    },
    findAllClasses: async () => {
      return await GradeModel.find();
    }
  }