import UsersModel from "../models/users.js";

export default {
  save: async (userEncrypt) => {
    return await UsersModel.create(userEncrypt);
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
  },
  findOrCreate: async (data) => {
    const email = data.emails[0].value;
    let user = await UsersModel.findOne({email: email});
    if(!user) {
      user = await UsersModel.create({
        name: displayName,
        email: email,
        avatar: data.picture,
        typeLogin: data.provider,
        verified: true
      });
    }

    return user;
  }
}