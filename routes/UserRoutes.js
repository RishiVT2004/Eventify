import { Router } from "express";
import dotenv from 'dotenv';
import {userSignup,userLogin,getUserProfile} from '../controller/user/UserLogin_SignpuController.js'
import { jwtAuth } from "../middlewares/Auth.js";

dotenv.config()
const router = Router();

router.post('/signup',userSignup);
router.post('/login',userLogin);
router.get('/profile',jwtAuth,getUserProfile);

export default router;