import usersService from "../services/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    const userExists = await usersService.findUserByEmail(email);

    if (!userExists) return res.status(400).json({message: `Invalid email or password`})

    const match = await bcrypt.compare(password, userExists.password);
    if (!match) return res.status(400).json({message: `Invalid email or password`})

    userExists.password = null;

    const accessToken = jwt.sign(JSON.stringify(userExists), process.env.SECRET_KEY);
    return res
      .cookie("access_token", accessToken, {
        httpOnly: true
      })
      .status(200)
      .json({ token: accessToken });
};

export const signOut = async (req, res, next) => {

  req.cookies.access_token? res.clearCookie("access_token") : null;

  req.userId? delete req.userId : null;

  res.end();
};