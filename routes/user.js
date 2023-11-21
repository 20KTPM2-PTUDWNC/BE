import * as express from 'express';
import * as userController from '../controllers/user.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import passport from 'passport';

const userRoute = express.Router();

userRoute.get('/user/:id', passport.authenticate('jwt', {session: false}), nextWrapper(userController.getUserProfile));

userRoute.put('/user/:id', passport.authenticate('jwt', {session: false}), nextWrapper(userController.updateUserProfile));

userRoute.post('/user/uploadPhoto/:id', passport.authenticate('jwt', {session: false}), nextWrapper(userController.uploadPhoto));

export default userRoute;