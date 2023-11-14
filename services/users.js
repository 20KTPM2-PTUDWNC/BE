import UsersModel from "../models/users.js";

export default {
  save: async (userEncrypt) => {
    await UsersModel.create(userEncrypt);
  },
  findUserByEmail: async (email) => {
    return await UsersModel.findOne({email});
  },
  findUserById: async (id) => {
    const user = await UsersModel.findById(id);
    user.password = undefined;
    return user;
  },
  findAllUsers: async () => {
    return await UsersModel.find();
  }
}