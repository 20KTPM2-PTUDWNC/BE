import * as express from 'express';
import authRoute from "./auth.js";
import { authentication } from '../middlewares/authentication.js';

const router = express.Router();

router.use('/', authRoute);

router.use(authentication);

export default router;