import * as express from 'express';
import authRoute from "./auth.js";
import userRoute from "./user.js";
import { authentication } from '../middlewares/authentication.js';

const router = express.Router();

router.use('/', authRoute);

router.use(authentication);

router.use('/', userRoute);

export default router;