import passport from 'passport';
import passportJwt from 'passport-jwt';
import passportGoogle from 'passport-google-oauth2';
import passportFacebook from 'passport-facebook';
import usersService from "../services/users.js";

const cookieExtractor = function (req) {
  console.log('authorization', req.headers['authorization']);
  return req.headers['authorization'];
};

const JwtStrategy = passportJwt.Strategy;
passport.use(new JwtStrategy({
  secretOrKey: process.env.SECRET_KEY,
  jwtFromRequest: cookieExtractor
}, async (payload, done) => {
  try {

    if (!payload) {
      return done(null, false);
    }

    console.log('payload', payload);

    return done(null, payload);
  } catch (error) {
    console.log('error', error);
    return done(error, false);
  }
}));

const GoogleStrategy = passportGoogle.Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/v1/auth/google/callback",
  passReqToCallback: true
},
  async function (request, accessToken, refreshToken, profile, done) {
    // findOrCreate
    const user = await usersService.findOrCreate(profile);
    return done(null, user);
  }
));

const FacebookStrategy = passportFacebook.Strategy;
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/v1/auth/facebook/callback",
  profileFields: ['id', 'email', 'displayName', 'photos']
},
  async function (accessToken, refreshToken, profile, cb) {
    const user = await usersService.findOrCreate(profile);
    return cb(null, user);
  }
));