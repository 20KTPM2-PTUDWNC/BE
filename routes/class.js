import * as express from 'express';
import * as classController from '../controllers/class.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import passport from 'passport';

const classRoute = express.Router();

classRoute.post('/class/createClass', passport.authenticate('jwt', {session: false}), nextWrapper(classController.createClass));

classRoute.get('/class/getAllClass', passport.authenticate('jwt', {session: false}), nextWrapper(classController.getAllClass));

classRoute.get('/class/getAllClassById', passport.authenticate('jwt', {session: false}), nextWrapper(classController.getAllClassById));

classRoute.get('/class/showClassDetail/:id', passport.authenticate('jwt', {session: false}), nextWrapper(classController.showClassDetail));

export default classRoute;