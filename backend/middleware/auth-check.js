const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
  console.log(req.headers.authorization);
  try{
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData =  {email: decodedToken.email, userId: decodedToken.userId};
    next();
  }catch(error){
    res.status(401).json({
      message: 'You are not authenticated'
    });
  }
};
