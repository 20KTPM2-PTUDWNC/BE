import usersService from "../services/users.js";
import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { transporter } from "../config/email.js"

export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Invalid User' });
  }

  // const userExists = await usersService.findUserByEmail(email);
  // if (userExists) {
  //   return res.status(400).json({ message: 'User Exists' });
  // }

  const passwordEncrypt = await bcrypt.hash(password, 10);

  const userEncrypt = {
    ...req.body,
    password: passwordEncrypt
  };

  const user = await usersService.save(userEncrypt);

  user.password = null;

  const accessToken = jwt.sign(JSON.stringify(user), process.env.SECRET_KEY);

  const link = `${process.env.FRONTEND_DOMAIN}/#/verifyAccount/${accessToken}`

  // setup email data
  const mailOptions = {
    from: process.env.MAILER_USER,
    to: email,
    subject: 'Account Verification',
    text: `Click this link to activate your account:\n${link}`
  };

  // send mail
  let info = await transporter.sendMail(mailOptions);
  if (!info) {
    res.status(400).json({ message: `Send email fail` })
  }

  res.status(200).json({ message: 'You need to verify your account by email' });
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const userExists = await usersService.findUserByEmail(email);

  if (!userExists) return res.status(400).json({ message: `Invalid email or password` })

  const match = await bcrypt.compare(password, userExists.password);
  if (!match) return res.status(400).json({ message: `Invalid email or password` })

  userExists.password = null;

  const accessToken = jwt.sign(JSON.stringify(userExists), process.env.SECRET_KEY);
  return res
    .cookie("token", accessToken, {
      httpOnly: true
    })
    .status(200)
    .json({ token: accessToken });
};

export const signOut = async (req, res, next) => {

  req.cookies.token ? res.clearCookie("token") : null;

  req.userId ? delete req.userId : null;

  res.end();
};

export const activateAccount = async (req, res, next) => {
  const tokenEncrypt = jwt.verify(req.params.token, process.env.SECRET_KEY);
  await User.findByIdAndUpdate({ _id: tokenEncrypt._id }, { verified: true },
    {
      new: true,
      runValidators: true
    });
  res.status(200).send('Email verified');
};