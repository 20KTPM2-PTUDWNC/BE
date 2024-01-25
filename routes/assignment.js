import * as express from 'express';
import * as assignmentController from '../controllers/assignment.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import passport from 'passport';
import multer from "multer";

const assignmentRoute = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Thư mục để lưu trữ tệp đã tải lên
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

assignmentRoute.post('/addAssignment/:gradeStructureId', passport.authenticate('jwt', {session: false}), nextWrapper(assignmentController.addAssignment));

assignmentRoute.get('/showAssignmentList/:gradeStructureId', passport.authenticate('jwt', {session: false}), nextWrapper(assignmentController.showAssignmentList));

assignmentRoute.post('/reviewAssignment/:studentGradeId', passport.authenticate('jwt', {session: false}), nextWrapper(assignmentController.reviewAssignment));

assignmentRoute.post('/uploadGradeList/:assignmentId', upload.single("file"), passport.authenticate('jwt', {session: false}), nextWrapper(assignmentController.uploadGradeList));

assignmentRoute.put('/markFinalDecision/:assignmentReviewId', passport.authenticate('jwt', {session: false}), nextWrapper(assignmentController.markFinalDecision));

assignmentRoute.get('/assignmentReviews/:assignmentId', passport.authenticate('jwt', {session: false}), nextWrapper(assignmentController.assignmentReviews));

assignmentRoute.get('/assignmentDetail/:assignmentId', passport.authenticate('jwt', {session: false}), nextWrapper(assignmentController.assignmentDetail));

export default assignmentRoute;