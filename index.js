const { result } = require("lodash");

const joiSchema = require("./models/Device/InternalDevice").joiSchema;

let payload = {
  id: "internalDevice",
  name: "internalDevice",
  type: "InternalDevice",
  variables: {
    "internal-current-L1": {
      id: "internal-current-L1",
      name: "PAC3200-CURRENT-L1",
      type: "AssociatedVariable",
      unit: "A",
      sampleTime: 1,
      defaultValue: 0,
      associatedElementID: "pac3200-1-current-L1",
      associatedDeviceID: "pac3200-1",
    },
  },
  calcElements: {},
  alerts: {},
  isActive: true,
};

let { error } = joiSchema.validate(payload);

if (error) console.log(error.details[0].message);
