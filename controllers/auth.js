import usersService from "../services/users.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({message: 'Invalid User'});
    }

    const userExists = await usersService.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({message: 'User Exists'});
    }

    const passwordEncrypt = await bcrypt.hash(password, 10);

    const userEncrypt = {
      ...req.body,
      password: passwordEncrypt
    };

    await usersService.save(userEncrypt);

    res.status(200).json({message: "Register successfully"});
};