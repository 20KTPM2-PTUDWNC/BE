import * as express from 'express';
import * as gradeController from '../controllers/grade.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import passport from 'passport';

const gradeRoute = express.Router();

gradeRoute.post('/grade/addGradeStructure/:classId', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.addGradeComposition));

gradeRoute.get('/grade/showGradeStructure/:classId', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.showGradeStructure));

gradeRoute.put('/grade/:classId/updateGradeComposition/:gradeCompositionId', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.updateGradeComposition));

gradeRoute.delete('/grade/:classId/deleteGradeComposition/:gradeCompositionId', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.deleteGradeComposition));

gradeRoute.patch('/grade/:classId/arrangeGradeComposition/:gradeCompositionId/position/:position', passport.authenticate('jwt', {session: false}), nextWrapper(gradeController.arrangeGradeComposition));

export default gradeRoute;