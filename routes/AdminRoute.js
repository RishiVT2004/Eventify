import {Router} from 'express';
import dotenv from 'dotenv'
import { adminSignup,adminLogin,getAdminProfile} from '../controller/admin/AdminController_Login_Signup_Get.js';
import { userList,eventUserList,BanUser,UnbanUser,DeleteUser } from '../controller/admin/AdminController_UserHandler.js';
import { createEvent , eventList , updateEvent , deleteEvent} from '../controller/admin/AdminController_EventHandler.js';
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
router.put('/banUser/:userID',jwtAuth,BanUser);  // ban a user 
router.put('/unbanUser/:userID',jwtAuth,UnbanUser) // unban a user
router.delete('/deleteUser/:userID',jwtAuth,DeleteUser) // deletes a user permanently 

// manage events 
router.get('/event',jwtAuth,eventList); // get list of event 
router.post('/event',jwtAuth,createEvent); // post a new event 
router.put('/updateEvent/:eventID',jwtAuth,updateEvent); // update info of an event 
router.delete('/deleteEvent/:eventID',jwtAuth,deleteEvent); // delete an event 



export default router;