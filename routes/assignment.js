import * as express from 'express';
import * as assignmentController from '../controllers/assignment.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import passport from 'passport';

const assignmentRoute = express.Router();

assignmentRoute.post('/assignment/addAssignment/:gradeStructureId', passport.authenticate('jwt', {session: false}), nextWrapper(assignmentController.addAssignment));

assignmentRoute.get('/assignment/showAssignmentList/:gradeStructureId', passport.authenticate('jwt', {session: false}), nextWrapper(assignmentController.showAssignmentList));

export default assignmentRoute;