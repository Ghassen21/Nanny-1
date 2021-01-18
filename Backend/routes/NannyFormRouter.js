const { body } = require('express-validator');
const express = require('express');
const router = express.Router();

const Register_NannyForm = require('../models/nannyformResgister');
const authController = require('../controllers/auth.js');
const auth = require('../middleware/auth.js');



router.post('/Nannys/nannyform',
[   auth, 
  body('FirstName').trim().not().isEmpty().withMessage('Please enter a valid FirstName.'),
  body('LastName').trim().not().isEmpty(),
  body('Age').trim().not().isEmpty(),
  body('Region').trim().not().isEmpty(),
  body('Phonenumber').trim().not().isEmpty(),
  body('About').trim().not().isEmpty(),
  body('Email').isEmail().withMessage('Please enter a valid email.')
  .custom(async (Email) => {
    const Nannyfound = await Register_NannyForm.findAll({ where: {
      Email:Email
    }
      
    });
      console.log("nanny alreeady founds:",Nannyfound)
      if (Nannyfound.length > 0) {
        return Promise.reject('Email address already exist!');
      }
    })
    //.normalizeEmail(),

], authController.FormNanny
);
module.exports = router;