import * as express from 'express';
import authRoute from "./auth.js";
import userRoute from "./user.js";

const router = express.Router();

router.use('/', authRoute);

router.use('/', userRoute);

export default router;