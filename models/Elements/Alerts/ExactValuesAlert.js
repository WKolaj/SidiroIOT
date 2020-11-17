const Joi = require("joi");
const { arraysEqual } = require("../../../utilities/utilities");
const elementProtocolVariableSchema = require("../Element");
const joiTextSchema = require("../ElementsValues/TranslationObject").joiSchema;

/**
 * @description Method for validating whole payload - checking if texts are valid - if there is text for every alert value and whether texts are valid
 * @param {*} exactValuesAlertPayload
 * @param {*} helpers
 */
const validateTextsPayload = (exactValuesAlertPayload, helpers) => {
  const { message } = helpers;
  const textsPayload = exactValuesAlertPayload.texts;
  const alertValuesPayload = exactValuesAlertPayload.alertValues;

  //enable texts to be undefined but not null
  if (textsPayload === undefined) return exactValuesAlertPayload;
  if (textsPayload === null) return message(`"textsPayload" cannot be null`);

  //Checking if all altert values have texts assigned
  let sortedTextsKeys = Object.keys(textsPayload)
    .map((key) => parseFloat(key))
    .sort((a, b) => a - b);
  let sortedAlertValues = alertValuesPayload.sort((a, b) => a - b);

  if (!arraysEqual(sortedTextsKeys, sortedAlertValues))
    return message(`"texts" keys have to correspond to the alertValues`);

  for (let textKey of sortedTextsKeys) {
    let textPayload = textsPayload[textKey];

    //validate every text one by one
    let result = joiTextSchema.validate(textPayload);
    if (result.error) return message(result.error.details[0].message);
  }

  return exactValuesAlertPayload;
};

const schemaContent = {
  ...elementProtocolVariableSchema.schemaContent,
  type: Joi.string().valid("ExactValuesAlert").required(),
  defaultValue: Joi.valid(null).required(),
  variableID: Joi.string().min(1).required(),
  alertValues: Joi.array().items(Joi.number()).required(),
  texts: Joi.object().optional(),
  severity: Joi.number().integer().required(),
  timeOnDelay: Joi.number().integer().min(0).required(),
  timeOffDelay: Joi.number().integer().min(0).required(),
};

//adding texts validation as custom validator
const joiSchema = Joi.object(schemaContent).custom(
  validateTextsPayload,
  "custom validation"
);

module.exports.schemaContent = schemaContent;
module.exports.joiSchema = joiSchema;
