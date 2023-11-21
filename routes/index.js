import * as express from 'express';
import authRoute from "./auth.js";
import userRoute from "./user.js";
import classRoute from "./class.js";

const router = express.Router();

router.use('/', authRoute);

router.use('/', userRoute);

router.use('/', classRoute);

export default router;