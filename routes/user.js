import * as express from 'express';
import * as userController from '../controllers/user.js';
import nextWrapper from '../middlewares/nextWrapper.js';

const userRoute = express.Router();

userRoute.get('/user/:id', nextWrapper(userController.getUserProfile));

export default userRoute;