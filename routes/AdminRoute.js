import {Router} from 'express';
import dotenv from 'dotenv'
import { adminSignup } from '../controller/AdminController.js';

dotenv.config();
const router = Router();

router.post('/api/signup' , adminSignup);

export default router;