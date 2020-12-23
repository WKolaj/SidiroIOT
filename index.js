const projectService = require("./services/projectService");

let data = {
  ipConfig: {
    eno1: { name: "eno1", dhcp: true, optional: true },
    eno2: {
      name: "eno2",
      dhcp: false,
      ipAddress: "192.168.120.200",
      subnetMask: "255.255.255.0",
      gateway: "192.168.120.1",
      optional: true,
      dns: [],
    },
  },
  data: {},
};

console.log(projectService.validateProjectPayload(data));
