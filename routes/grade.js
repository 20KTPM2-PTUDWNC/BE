import * as express from 'express';
import * as gradeController from '../controllers/grade.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import passport from 'passport';

const gradeRoute = express.Router();

gradeRoute.post('/addGradeStructure/:classId', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.addGradeComposition));

gradeRoute.get('/showGradeStructure/:classId', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.showGradeStructure));

gradeRoute.put('/:classId/updateGradeComposition/:gradeCompositionId', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.updateGradeComposition));

gradeRoute.delete('/:classId/deleteGradeComposition/:gradeCompositionId', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.deleteGradeComposition));

gradeRoute.patch('/:classId/arrangeGradeComposition/:gradeCompositionId/position/:position', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.arrangeGradeComposition));

gradeRoute.get('/exportStudentList/:classId', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.exportStudentList));

gradeRoute.get('/exportGradeList/:assignmentId', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.exportGradeList));

gradeRoute.post('/studentGrade', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.studentGrade));

gradeRoute.get('/studentGrade/:assignmentId', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.getStudentGrade));

gradeRoute.get('/exportGradeBoard/:classId', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.exportGradeBoard));

gradeRoute.get('/showGradeById/:userId', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.showGradeById));

gradeRoute.get('/showStudentGradeByTeacher/:classId', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.showStudentGradeByTeacher));

export default gradeRoute;