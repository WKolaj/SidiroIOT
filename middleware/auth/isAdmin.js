const User = require("../../classes/User/User");

//Middleware method for authorization
//Method for checking if user is admin or send respones 403 to client if not
module.exports = function (req, res, next) {
  if (!User.isAdmin(req.user.permissions)) {
    return res.status(403).send("Access forbidden.");
  }

  next();
};
