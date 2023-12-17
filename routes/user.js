import * as express from 'express';
import * as userController from '../controllers/user.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import passport from 'passport';

const userRoute = express.Router();

userRoute.get('/:id', passport.authenticate('jwt', {session: false}), nextWrapper(userController.getUserProfile));

userRoute.put('/:id', passport.authenticate('jwt', {session: false}), nextWrapper(userController.updateUserProfile));

userRoute.post('/uploadPhoto/:id', passport.authenticate('jwt', {session: false}), nextWrapper(userController.uploadPhoto));

userRoute.post('/mappingStudentId', passport.authenticate('jwt', {session: false}), nextWrapper(userController.mappingStudentId));

userRoute.get('/', passport.authenticate('jwt', {session: false}), nextWrapper(userController.getAllUser));

userRoute.patch('/lockAccount/:userId', passport.authenticate('jwt', {session: false}), nextWrapper(userController.lockAccount));

userRoute.patch('/unmappingStudentId/:userId', passport.authenticate('jwt', {session: false}), nextWrapper(userController.unmappingStudentId));

export default userRoute;