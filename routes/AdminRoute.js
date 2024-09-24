import {Router} from 'express';
import dotenv from 'dotenv'
import { adminSignup,adminLogin} from '../controller/AdminController.js';

dotenv.config();
const router = Router();

// login and signup
router.post('/signup' , adminSignup);
router.post('/login' , adminLogin);

// manage events 
router.get('/events'); // get list of event 
router.post('/events'); // post a new event 
router.put('/events/:eventID'); // update info of an event 
router.delete('/event/:eventID'); // delete an event 

// manage users
router.get('/:eventID/users'); // gets list of all users registered in a particular event 
router.put('/users/:userID'); // updates role of a user (can make him admin)
router.delete('/users/:userID');  // delete a user 


export default router;