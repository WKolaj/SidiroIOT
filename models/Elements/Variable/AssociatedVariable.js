const Joi = require("joi");
const elementSchema = require("../Element");

const schemaContent = {
  ...elementSchema.schemaContent,
  associatedDeviceID: Joi.string().min(1).required(),
  associatedElementID: Joi.string().min(1).required(),
  type: Joi.string().valid("AssociatedVariable").required(),
};

//defaultValue should not be set - it is retrieved from original value
delete schemaContent.defaultValue;

const joiSchema = Joi.object(schemaContent);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
