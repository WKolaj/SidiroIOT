const MBDevice = require("../../../../classes/Device/ConnectableDevice/MBDevice");
const MBDriver = require("../../../../classes/Driver/MBDriver");
const MBRequestManager = require("../../../../classes/Request/MBRequest/MBRequestManager");

describe("MBDevice", () => {
  describe("constructor", () => {
    let exec = () => {
      return new MBDevice();
    };

    it("should create new MBDevice and set its RequestManager to MBRequestManager and Driver to MBDriver", async () => {
      let result = exec();

      expect(result).toBeDefined();

      expect(result.RequestManager).toBeDefined();
      expect(result.RequestManager instanceof MBRequestManager).toEqual(true);

      expect(result.Driver).toBeDefined();
      expect(result.Driver instanceof MBDriver).toEqual(true);
    });
  });

  describe("init", () => {
    let device;
    let payload;

    beforeEach(() => {
      payload = {
        id: "testDeviceID",
        name: "testDeviceName",
        type: "MBDevice",
        variables: {},
        calcElements: {},
        alerts: {},
        isActive: true,
        ipAddress: "192.168.100.100",
        portNumber: 602,
        timeout: 2500,
      };
    });

    let exec = async () => {
      device = new MBDevice();
      return device.init(payload);
    };

    it("should initialize MBDevice based on given payload", async () => {
      await exec();

      expect(device.ID).toEqual("testDeviceID");
      expect(device.Name).toEqual("testDeviceName");
      expect(device.Type).toEqual("MBDevice");
      expect(device.Variables).toEqual({});
      expect(device.CalcElements).toEqual({});
      expect(device.Alerts).toEqual({});
      expect(device.IsActive).toEqual(true);
      expect(device.IPAddress).toEqual("192.168.100.100");
      expect(device.PortNumber).toEqual(602);
      expect(device.Timeout).toEqual(2500);
    });

    it("should not initialize MBDevice and throw - if type is different than MBDevice", async () => {
      payload.type = "FakeType";

      let error = null;

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(1);
          } catch (err) {
            error = err;
            return reject(err);
          }
        })
      ).rejects.toBeDefined();

      expect(error.message).toEqual("Trying to set type FakeType to MBDevice!");
    });
  });
});
