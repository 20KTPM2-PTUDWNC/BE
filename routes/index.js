import * as express from 'express';
import authRoute from "./auth.js";
import userRoute from "./user.js";
import classRoute from "./class.js";
import gradeRoute from "./grade.js";
import userClassRoute from "./userClass.js";
import assignmentRoute from "./assignment.js";

const router = express.Router();

router.use('/', authRoute);

router.use('/user', userRoute);

router.use('/class', classRoute);

router.use('/grade', gradeRoute);

router.use('/userClass', userClassRoute);

router.use('/assignment', assignmentRoute);

export default router;