import * as express from 'express';
import * as userController from '../controllers/user.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import passport from 'passport';
import multer from "multer";

const userRoute = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Thư mục để lưu trữ tệp đã tải lên
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

userRoute.get('/:id', passport.authenticate('jwt', {session: false}), nextWrapper(userController.getUserProfile));

userRoute.put('/:id', passport.authenticate('jwt', {session: false}), nextWrapper(userController.updateUserProfile));

userRoute.post('/uploadPhoto/:id', passport.authenticate('jwt', {session: false}), nextWrapper(userController.uploadPhoto));

userRoute.post('/mappingStudentId', passport.authenticate('jwt', {session: false}), nextWrapper(userController.mappingStudentId));

userRoute.get('/', passport.authenticate('jwt', {session: false}), nextWrapper(userController.getAllUser));

userRoute.patch('/lockAccount/:userId', passport.authenticate('jwt', {session: false}), nextWrapper(userController.lockAccount));

userRoute.patch('/unmappingStudentId/:userId', passport.authenticate('jwt', {session: false}), nextWrapper(userController.unmappingStudentId));

userRoute.post('/mappingStudentIdByCsv', upload.single("file"), passport.authenticate('jwt', {session: false}), nextWrapper(userController.mappingStudentIdByCsv));

userRoute.get('/notification/:userId', passport.authenticate('jwt', {session: false}), nextWrapper(userController.notification));

userRoute.put('/notification/:notificationId', passport.authenticate('jwt', {session: false}), nextWrapper(userController.markNotification));

userRoute.post('/reviewStudentId', passport.authenticate('jwt', {session: false}), nextWrapper(userController.reviewStudentId));

userRoute.get('/studentIdReviewDetail/:userId', passport.authenticate('jwt', {session: false}), nextWrapper(userController.studentIdReviewDetail));

userRoute.get('/studentReview/all', passport.authenticate('jwt', {session: false}), nextWrapper(userController.studentReviews));

export default userRoute;