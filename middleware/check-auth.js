// import jsonwebtoken
const jwt = require('jsonwebtoken');

module.exports = ( req, res, next ) => {
  try {
    // get the jwt from the header that we just sent 
    let token = req.headers['authorization'].split('')[2];

    // verify it
    const decoded = jwt.verify( token, process.env.APP_SECRET );

    // append the user data to the request so every request that requires authentication has it
    req.userData = decoded;

    next();

  } catch(err) {
    return res.status(401).json({ "message": "User Not Authorized"});
  }
}