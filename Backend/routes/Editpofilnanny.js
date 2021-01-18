const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.js');
const auth = require('../middleware/auth.js');


router.put('/editprofile',auth, authController.Edit);

module.exports = router;