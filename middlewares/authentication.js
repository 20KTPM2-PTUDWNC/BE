import { apiError } from "../constanst.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import passportJwt from 'passport-jwt';

const cookieExtractor = function (req) {
  const token = null;
  if (req.headers['authorization'] && typeof req.headers['authorization'] === 'string') {
    token = req.headers['authorization'].split(' ')[1];
  }
  return token;
};

const JwtStrategy = passportJwt.Strategy;
passport.use(new JwtStrategy({
  secretOrKey: process.env.SECRET_KEY,
  jwtFromRequest: cookieExtractor
}, async (payload, done) => {
  try {

    const user = { id: payload.userId, username: payload.username };

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

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

export default passport;