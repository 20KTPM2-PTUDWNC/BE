import * as express from 'express';
import * as userController from '../controllers/user.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import { authentication } from '../middlewares/authentication.js';

const userRoute = express.Router();

userRoute.get('/user/:id', authentication, nextWrapper(userController.getUserProfile));

userRoute.put('/user/:id', authentication, nextWrapper(userController.updateUserProfile));

userRoute.post('/user/uploadPhoto/:id', authentication, nextWrapper(userController.uploadPhoto));

export default userRoute;