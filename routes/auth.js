import * as express from 'express';
import * as authController from '../controllers/auth.js';
import nextWrapper from '../middlewares/nextWrapper.js';

const authRoute = express.Router();

authRoute.post('/signUp', nextWrapper(authController.signUp));

export default authRoute;