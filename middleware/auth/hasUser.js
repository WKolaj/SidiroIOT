const config = require("config");
const jwt = require("jsonwebtoken");

const headerName = config.get("tokenHeader");
const jwtPrivateKey = config.get("jwtPrivateKey");

//Middleware method for authentication - checking if there is a logged user that send this request
//This middleware should be applied before authorization - eg. isAdmin
//Users decoded payload (from jwt) will be automatically assigned to req.user object
module.exports = function (req, res, next) {
  let token = req.header(headerName);

  //Checking if token is presented in payload
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    //Checking if token is valid - signed by application private key.
    //If not, statment below will throw

    //Fetching users payload (decoded from jwt) as user object in request
    req.user = jwt.verify(token, jwtPrivateKey);

    //Calling next middleware
    next();
  } catch (err) {
    //Sending response to client if token is invalid
    return res.status(400).send("Invalid token provided");
  }
};
