import * as express from 'express';
import * as authController from '../controllers/auth.js';
import nextWrapper from '../middlewares/nextWrapper.js';

const authRoute = express.Router();

authRoute.post('/signUp', nextWrapper(authController.signUp));

authRoute.post('/signIn', nextWrapper(authController.signIn));

authRoute.get('/signOut', nextWrapper(authController.signOut));

export default authRoute;