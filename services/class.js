import ClassModel from "../models/class.js";

export default {
    save: async (newClass) => {
      return await ClassModel.create(newClass);
    },
    findClassByName: async (name) => {
      return await ClassModel.findOne({name});
    },
    findClassById: async (id) => {
      const _class = await ClassModel.findById(id);
      return _class;
    },
    findAllClasses: async () => {
      return await ClassModel.find();
    }
  }