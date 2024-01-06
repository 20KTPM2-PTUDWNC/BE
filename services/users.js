import UsersModel from "../models/users.js";
import StudentIdReviewModel from "../models/studentIdReview.js";

export default {
  save: async (userEncrypt) => {
    return await UsersModel.create(userEncrypt);
  },
  findUserByEmail: async (email) => {
    return await UsersModel.findOne({ email, deleteAt: null });
  },
  findUserById: async (id) => {
    const user = await UsersModel.findById(id);
    user ? user.password = undefined : null;
    return user;
  },
  findAllUsers: async () => {
    return await UsersModel.find();
  },
  findOrCreate: async (data) => {
    const email = data.emails[0].value;
    let user = await UsersModel.findOne({ email: email });
    if (!user) {
      user = await UsersModel.create({
        name: displayName,
        email: email,
        avatar: data.picture,
        typeLogin: data.provider,
        verified: true
      });
    }

    return user;
  },
  isStudentIdMapped: async (studentId, userId) => {
    const user = await UsersModel.findOne({ studentId });

    if (user) {
      return user.id === userId ? true : false;
    }

    return true;
  },
  updateStudentIdReview: async (data) => {
    return await StudentIdReviewModel.create(data);
  },
  findUserByStudentId: async (studentId) => {
    return await UsersModel.findOne({ studentId });
  },
}