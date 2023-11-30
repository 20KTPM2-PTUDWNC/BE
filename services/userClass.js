import userClassModel, { UserRole } from "../models/userClass.js";

export default {
    save: async (userClass) => {
        return await userClassModel.create(userClass);
    },
    findAllStudentById: async (classId) => {
        const projection = { _id: 0, studentId: 1, name: 1 };
        const students = await userClassModel.find({ classId, userRole: UserRole.Student }, projection);
        return students;
    },
    checkStudentInClass: async (classId, userId) => {
        const students = await userClassModel.findOne({ classId, userId });
        return students? true : false;
    }
}