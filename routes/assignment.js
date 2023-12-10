import * as express from 'express';
import * as assignmentController from '../controllers/assignment.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import passport from 'passport';

const assignmentRoute = express.Router();

assignmentRoute.post('/addAssignment/:gradeStructureId', passport.authenticate('jwt', {session: false}), nextWrapper(assignmentController.addAssignment));

assignmentRoute.get('/showAssignmentList/:gradeStructureId', passport.authenticate('jwt', {session: false}), nextWrapper(assignmentController.showAssignmentList));

assignmentRoute.post('/reviewAssignment/:studentGradeId', passport.authenticate('jwt', {session: false}), nextWrapper(assignmentController.reviewAssignment));

export default assignmentRoute;