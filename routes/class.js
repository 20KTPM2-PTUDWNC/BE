import * as express from 'express';
import * as classController from '../controllers/class.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import passport from 'passport';
import multer from "multer";

const classRoute = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Thư mục để lưu trữ tệp đã tải lên
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

classRoute.post('/createClass', passport.authenticate('jwt', {session: false}), nextWrapper(classController.createClass));

classRoute.get('/getAllClass', passport.authenticate('jwt', {session: false}), nextWrapper(classController.getAllClass));

classRoute.get('/getAllClassById', passport.authenticate('jwt', {session: false}), nextWrapper(classController.getAllClassById));

classRoute.get('/showClassDetail/:id', passport.authenticate('jwt', {session: false}), nextWrapper(classController.showClassDetail));

classRoute.post('/createInvitationLink', passport.authenticate('jwt', {session: false}), nextWrapper(classController.createInvitationLink));

classRoute.post('/invitationByEmail', passport.authenticate('jwt', {session: false}), nextWrapper(classController.invitationByEmail));

classRoute.post('/acceptInvitation', passport.authenticate('jwt', {session: false}), nextWrapper(classController.acceptInvitation));

classRoute.post('/joinClass', passport.authenticate('jwt', {session: false}), nextWrapper(classController.joinClass));

classRoute.put('/activeClass/:classId', passport.authenticate('jwt', {session: false}), nextWrapper(classController.activeClass));

classRoute.post('/uploadStudentList/:classId', upload.single("file"), passport.authenticate('jwt', {session: false}), nextWrapper(classController.uploadStudentList));

classRoute.get('/showStudentList/:classId', passport.authenticate('jwt', {session: false}), nextWrapper(classController.showStudentList));

classRoute.get('/:classId/studentNoGrade/:assignmentId', passport.authenticate('jwt', {session: false}), nextWrapper(classController.studentNoGrade));

export default classRoute;