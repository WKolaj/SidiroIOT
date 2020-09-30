/**
 * @description Method for validating request body - sending 400 to client if there was an error
 * @param {Object} joiValidator Method that return {error:errortext} in case there was an rror during validation, or empty object otherwise
 */
module.exports = (joiValidator) => {
  return (req, res, next) => {
    //Validating body with validator method
    const { error } = joiValidator(req.body);

    //Sending error to customer if exists - joi will store it inside error.details[0].message
    if (error) return res.status(400).send(error.details[0].message);

    //Calling next middleware if there was no error
    next();
  };
};
