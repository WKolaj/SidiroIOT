const { result } = require("lodash");

const joiSchema = require("./models/Elements/Alerts/ExactValuesAlert")
  .joiSchema;

let payload = {
  id: "pac3200-1-current-alert",
  name: "PAC3200-1-current-alert",
  type: "ExactValuesAlert",
  unit: "A",
  sampleTime: 1,
  defaultValue: null,
  variableID: "pac3200-1-current-L1",
  alertValues: [10, 20, 30, 40, 50],
  severity: 10,
  timeOnDelay: 5,
  timeOffDelay: 10,
  texts: {
    10: {
      en: "step 1: $VALUE",
      pl: "próg 1: $VALUE",
    },
    20: {
      en: "step 2: $VALUE",
      pl: "próg 2: $VALUE",
    },
    30: {
      en: "step 3: $VALUE",
      pl: "próg 3: $VALUE",
    },
    40: {
      en: "step 4: $VALUE",
      pl: "próg 4: $VALUE",
    },
    50: {
      en: "step 5: $VALUE",
      pl: "próg 5: $VALUE",
    },
  },
};

let { error } = joiSchema.validate(payload);

if (error) console.log(error.details[0].message);
