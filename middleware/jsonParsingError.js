//Method used for returning error 400 in case there was an error during JSON parsing
//It should be used right after router.use(express.json()) in order to catch error produced while parsing
module.exports = function (err, req, res, next) {
  //If there was an error during previous middleware (parsing) - returning 400
  if (err) {
    return res.status(400).send("Invalid request content");
  }

  //If there was no error - going further with next middleware
  next();
};
