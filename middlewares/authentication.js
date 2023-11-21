import { apiError } from "../constanst.js";
import jwt from "jsonwebtoken";

export const authentication = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(400).json({ message: apiError.forbidden });

  try {
    const tokenEncrypt = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = tokenEncrypt._id
    next();
  } catch (error) {
    return res.status(400).json({ message: apiError.forbidden });
  }
}
