import {Router} from 'express';
import dotenv from 'dotenv'
import { adminSignup,adminLogin,getAdminProfile} from '../controller/admin/AdminController_Login_Signup_Get.js';
import { userList,eventUserList,BanUser,UnbanUser,DeleteUser } from '../controller/admin/AdminController_UserHandler.js';
import { jwtAuth } from '../middlewares/Auth.js';

dotenv.config();
const router = Router();

// get admin info 
router.get('/profile',jwtAuth,getAdminProfile)
// login and signup
router.post('/signup' , adminSignup);
router.post('/login' , adminLogin);


// manage users
router.get('/userList',jwtAuth,userList); // gets list of all users registered in a particular event 
router.get(':eventID/userList',jwtAuth,eventUserList) // get list of registered in a particular event 
router.put('/BanUser/:userID',jwtAuth,BanUser);  // ban a user 
router.put('/UnbanUser/:userID',jwtAuth,UnbanUser) // unban a user
router.delete('/DeleteUser/:userID',jwtAuth,DeleteUser) // deletes a user permanently 

// manage events 
router.get('/events'); // get list of event 
router.post('/events'); // post a new event 
router.put('/events/:eventID'); // update info of an event 
router.delete('/event/:eventID'); // delete an event 



export default router;