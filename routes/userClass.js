import * as express from 'express';
import * as userClassController from '../controllers/userClass.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import passport from 'passport';

const userClassRoute = express.Router();

userClassRoute.get('/userClass/:classId', passport.authenticate('jwt', {session: false}), nextWrapper(userClassController.showMemberList));

export default userClassRoute;