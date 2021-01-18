const { validationResult } = require("express-validator");
//const Sequelize = require('sequelize');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User_table_register = require("../models/user");
const Register_NannyForm = require("../models/nannyformResgister");
require("dotenv").config();
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  console.log("erro:", errors);
  console.log("post on /register", req.body);
  if (!errors.isEmpty()) return;
  try {
    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const Email = req.body.Email;
    const Password = req.body.Password;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(Password, salt);

    //Insert into table
    var result = await User_table_register.create({
      FirstName,
      LastName,
      Email,
      Password: hashedPassword,
    });
    res.status(201).json({ message: "User registered!", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const Email = req.body.Email;
    const Password = req.body.Password;
    if (!Email || !Password)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    // check the user exisit or not
    const user = await User_table_register.findAll({
      where: {
        Email: Email,
      },
    });
    if (user.length !== 1) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }

    const storedUser = user[0];
    console.log("stored password:", storedUser.Password);
    const isEqual = await bcrypt.compare(Password, storedUser.Password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      { userId: storedUser.id },
      `${process.env.JWT_SECRET_KEY}`
    );
    console.log(token)
    res
      .status(200).json({ message: "you are welcome " })

  } catch (err) {
    res.status(500).json({ errorinthelogginauth: err.message });
  }
};
exports.FormNanny = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return;
  try {
    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const Age = req.body.Age;
    const Region = req.body.Region;
    const Phonenumber = req.body.Phonenumber;
    const About = req.body.About;
    const Email = req.body.Email;
    //Insert  nanny and save it into table
    var resultNannyregisterted = await Register_NannyForm.create({
      FirstName,
      LastName,
      Age,
      Region,
      Phonenumber,
      About,
      Email,
    });
    res
      .status(201)
      .json({ message: "Nanny registered!", resultNannyregisterted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.Edit = async (req, res) => {
  try {
    const id =req.user;
    const FirstName = req.body.FirstName;
    const LastName = req.body.Lastname;
    const Age = req.body.Age;
    const Phonenumber = req.body.Phonenumber;
    const Region = req.body.Region;
    const About = req.body.About;
    const Email = req.body.Email;
    
    console.log(req.body)
    let filtred = Object.entries(req.body).filter(x => x[1] !== '')
    console.log("req after filtered ", filtred);
    var filtredobjectdata = {};
    for (var ele of filtred) {   
      filtredobjectdata[ele[0]] = ele[1]
    }
    console.log("filtredobject",filtredobjectdata)
    var resultNannyeditFound = await Register_NannyForm.findByPk(id)
    console.log("resultNannyeditFound",resultNannyeditFound)
    if (resultNannyeditFound === null) {
      console.error("nanny not found");
    } else {
     updated =await Register_NannyForm.update(filtredobjectdata ,{where:{id:resultNannyeditFound.id}})
     console.log("updated",updated)
     res
      .status(201)
      .json({ message: "Nannyprofile Updated!" });
    }

  } catch (err) {
    res.status(500).json({ errorfromeditprofile: err.message });
  }
}

/*Project.find({ where: { title: 'aProject' } })
  .on('success', function (project) {
    // Check if record exists in db
    if (project) {
      project.update({
        title: 'a very different title now'
      })
      .success(function () {})
    }
  })*/
