import * as express from 'express';
import authRoute from "./auth.js";
import userRoute from "./user.js";
import classRoute from "./class.js";
import gradeRoute from "./grade.js";
import userClassRoute from "./userClass.js";

const router = express.Router();

router.use('/', authRoute);

router.use('/', userRoute);

router.use('/', classRoute);

router.use('/', gradeRoute);

router.use('/', userClassRoute);

export default router;