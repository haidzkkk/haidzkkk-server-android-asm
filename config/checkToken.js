var jwt = require('jsonwebtoken');

const checkToken = (req, res, next)  =>{
    const token = req.cookies.token;

  if(!token){
    res.clearCookie('token')
    res.json({ success: false, msg: 'login failed.' });
  }else{
    try{
      const userToken = jwt.verify(token, "SecretToken");

      req.user = userToken.user

      next();

    }catch(err){
      res.clearCookie('token')
      res.json({ success: false, msg: 'login failed.' });
    }
  }
}

module.exports = checkToken;