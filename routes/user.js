import * as express from 'express';
import * as userController from '../controllers/user.js';
import nextWrapper from '../middlewares/nextWrapper.js';

const userRoute = express.Router();

userRoute.get('/user/:id', nextWrapper(userController.getUserProfile));

userRoute.put('/user/:id', nextWrapper(userController.updateUserProfile));

export default userRoute;