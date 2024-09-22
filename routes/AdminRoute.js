const {Router} = require('express');
require('dotenv').config()

const router = Router();

router.post('api/signup' , adminSignup);