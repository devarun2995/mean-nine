const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) =>{
  bcrypt.hash(req.body.password, 10).then(hash =>{
    const user = new User({
      email: req.body.email,
      password: hash
    });
      user.save().then(result =>{
        res.status(201).json({
        message: 'User added !',
        result: result
        });
      }).catch(err => {
        res.status(500).json({
          error: err,
          message: 'User Already exists'
        });
      });
  });
}

exports.userLogin =  (req, res, next) =>{
  let fetchedUserData;
  User.findOne({email :req.body.email}).then(user=>{
    if(!user){
      return res.status(401).json({
        message : 'user name does not exist'
      });
    }
    fetchedUserData = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result =>{
    if(!result){
      return res.status(401).json({
        message: 'incorrect password'
      });
    }
    const token = jwt.sign({email: fetchedUserData.email, userId: fetchedUserData._id},
       process.env.JWT_KEY,
       {expiresIn: "1h" });
       res.status(200).json({
         token: token,
         expiresIn: 3600,
         userId: fetchedUserData._id
       });
  }).catch(err =>{
    return res.status(500).json({
      message: 'Invalid Credentials'
    });
  });
}
