import * as express from 'express';
import * as classController from '../controllers/class.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import passport from 'passport';

const classRoute = express.Router();

classRoute.post('/createClass', passport.authenticate('jwt', {session: false}), nextWrapper(classController.createClass));

classRoute.get('/getAllClass', passport.authenticate('jwt', {session: false}), nextWrapper(classController.getAllClass));

classRoute.get('/showClassDetail/:id', passport.authenticate('jwt', {session: false}), nextWrapper(classController.showClassDetail));

classRoute.post('/createInvitationLink', passport.authenticate('jwt', {session: false}), nextWrapper(classController.createInvitationLink));

classRoute.post('/invitationByEmail', passport.authenticate('jwt', {session: false}), nextWrapper(classController.invitationByEmail));

classRoute.post('/acceptInvitation', passport.authenticate('jwt', {session: false}), nextWrapper(classController.acceptInvitation));

classRoute.post('/joinClass', passport.authenticate('jwt', {session: false}), nextWrapper(classController.joinClass));

classRoute.get('/getAllClassById', passport.authenticate('jwt', {session: false}), nextWrapper(classController.getAllClassById));

export default classRoute;