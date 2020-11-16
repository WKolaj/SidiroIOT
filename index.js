const joiSchema = require("./models/Elements/Alerts/BandwithLimitAlert")
  .joiSchema;

let payload = {
  id: "pac3200-1-current-alert",
  name: "PAC3200-1-current-alert",
  type: "BandwidthLimitAlert",
  unit: "A",
  sampleTime: 1,
  defaultValue: null,
  variableID: "pac3200-1-current-L1",
  lowLimit: -219,
  highLimit: -200,
  severity: 10,
  hysteresis: 10,
  timeOnDelay: 5,
  timeOffDelay: 10,
};

let { error } = joiSchema.validate(payload);

console.log(error.details[0].message);
