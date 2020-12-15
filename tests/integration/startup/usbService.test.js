describe("usbService", () => {
  let usbService;
  let usbServiceInitMockFunc;
  let usbServiceStartMockFunc;
  let logger;
  let loggerInfoMockFunc;
  let loggerWarnMockFunc;
  let loggerErrorMockFunc;

  beforeEach(async () => {
    usbServiceInitMockFunc = jest.fn();
    usbServiceStartMockFunc = jest.fn();

    usbService = require("../../../services/usbService");
    usbService.init = usbServiceInitMockFunc;
    usbService.start = usbServiceStartMockFunc;

    logger = require("../../../logger/logger");
    loggerInfoMockFunc = jest.fn();
    loggerWarnMockFunc = jest.fn();
    loggerErrorMockFunc = jest.fn();

    logger.info = loggerInfoMockFunc;
    logger.warn = loggerWarnMockFunc;
    logger.error = loggerErrorMockFunc;
  });

  describe("startup - usb service", () => {
    let exec = async () => {
      await require("../../../startup/usb")();
    };

    it("should call init and start of usb service - in this order", async () => {
      await exec();

      expect(usbServiceInitMockFunc).toHaveBeenCalledTimes(1);
      expect(usbServiceStartMockFunc).toHaveBeenCalledTimes(1);

      expect(usbServiceInitMockFunc).toHaveBeenCalledBefore(
        usbServiceStartMockFunc
      );
    });

    it("should call logger info", async () => {
      await exec();

      expect(loggerInfoMockFunc).toHaveBeenCalledTimes(2);
      expect(loggerInfoMockFunc.mock.calls[0][0]).toEqual(
        "initializing usb service.."
      );
      expect(loggerInfoMockFunc.mock.calls[1][0]).toEqual(
        "usb service initialized"
      );
    });
  });
});
