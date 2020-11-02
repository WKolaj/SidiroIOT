const ConnectableVariable = require("../../../../../classes/Element/Variable/ConnectableVariable/ConnectableVariable");

describe("ConnectableVariable", () => {
  describe("constructor", () => {
    let exec = () => {
      return new ConnectableVariable();
    };

    it("should create new ConnectableVariable and set all its properties to null", () => {
      let result = exec();

      expect(result.ID).toEqual(null);
      expect(result.Name).toEqual(null);
      expect(result.Type).toEqual(null);

      //Value should not be checked - method _convertDataToValue is not set
      //expect(result.Value).toEqual(null);
      expect(result.DefaultValue).toEqual(null);
      expect(result.LastValueTick).toEqual(null);
      expect(result.Unit).toEqual(null);
      expect(result.SampleTime).toEqual(null);
    });

    it("should create new ConnectableVariable and set data to null", () => {
      let result = exec();

      expect(result.Data).toEqual(null);
    });

    it("should create new ConnectableVariable and set read/write/readSeperately/writeSeperately as null", () => {
      let result = exec();

      expect(result.Read).toEqual(null);
      expect(result.Write).toEqual(null);
      expect(result.ReadSeperately).toEqual(null);
      expect(result.WriteSeperately).toEqual(null);
    });
  });

  describe("init", () => {
    let payload;
    let variable;
    let convertValueToDataMockFunc;
    let convertDataToValueMockFunc;

    beforeEach(() => {
      payload = {
        id: "testElementId",
        name: "testElementName",
        type: "testElementType",
        defaultValue: 10,
        sampleTime: "testElementSampleTime",
        read: true,
        write: false,
        readAsSingle: true,
        writeAsSingle: false,
      };

      //Creating mocking method for converting data to value
      //Data contains elements [1,2,3,4...]
      //Value contains the sum of all elements in array
      convertDataToValueMockFunc = jest.fn((data) => {
        let valueToReturn = 0;
        for (let value of data) valueToReturn += value;
        return valueToReturn;
      });

      convertValueToDataMockFunc = jest.fn((value) => {
        let dataToReturn = [];
        let index = 1;
        let restOfValue = value;
        while (restOfValue > 0) {
          dataToReturn.push(index);
          restOfValue -= index;
          index++;
        }
        return dataToReturn;
      });
    });

    let exec = async () => {
      variable = new ConnectableVariable();
      variable._convertDataToValue = convertDataToValueMockFunc;
      variable._convertValueToData = convertValueToDataMockFunc;

      return variable.init(payload);
    };

    it("should initialize variable's properties based on their payload", async () => {
      await exec();

      expect(variable.ID).toEqual("testElementId");
      expect(variable.Name).toEqual("testElementName");
      expect(variable.Type).toEqual("testElementType");
      expect(variable.DefaultValue).toEqual(10);
      expect(variable.SampleTime).toEqual("testElementSampleTime");

      expect(variable.Value).toEqual(10);
      expect(variable.LastValueTick).toEqual(0);

      //default Value 10 corresponds to [1,2,3,4] in Data;
      expect(variable.Data).toEqual([1, 2, 3, 4]);

      expect(variable.Read).toEqual(true);
      expect(variable.Write).toEqual(false);
      expect(variable.ReadSeperately).toEqual(true);
      expect(variable.WriteSeperately).toEqual(false);
    });

    it("should call _convertValueToDataMockFunc in order to set Data based on defaultValue", async () => {
      await exec();

      //ConvertValueToData should have been called
      expect(convertValueToDataMockFunc).toHaveBeenCalledTimes(1);
      expect(convertValueToDataMockFunc.mock.calls[0][0]).toEqual(10);
    });
  });

  describe("get Value", () => {
    let data;
    let variable;
    let convertValueToDataMockFunc;
    let convertDataToValueMockFunc;

    beforeEach(() => {
      //[1,2,3,4] corresponds to value of 10
      data = [1, 2, 3, 4];

      //Creating mocking method for converting data to value
      //Data contains elements [1,2,3,4...]
      //Value contains the sum of all elements in array
      convertDataToValueMockFunc = jest.fn((data) => {
        let valueToReturn = 0;
        for (let value of data) valueToReturn += value;
        return valueToReturn;
      });

      convertValueToDataMockFunc = jest.fn((value) => {
        let dataToReturn = [];
        let index = 1;
        let restOfValue = value;
        while (restOfValue > 0) {
          dataToReturn.push(index);
          restOfValue -= index;
          index++;
        }
        return dataToReturn;
      });
    });

    let exec = async () => {
      variable = new ConnectableVariable();
      variable._convertDataToValue = convertDataToValueMockFunc;
      variable._convertValueToData = convertValueToDataMockFunc;

      variable._data = data;

      return variable.Value;
    };

    it("should return data converted to value", async () => {
      await exec();

      expect(variable.Value).toEqual(10);
    });

    it("should call _convertDataToValueMockFunc in order to set Value based on data", async () => {
      await exec();

      //ConvertDataToValue should have been called
      expect(convertDataToValueMockFunc).toHaveBeenCalledTimes(1);
      expect(convertDataToValueMockFunc.mock.calls[0][0]).toEqual([1, 2, 3, 4]);
    });
  });

  describe("setValue", () => {
    let value;
    let tickId;
    let variable;
    let convertValueToDataMockFunc;
    let convertDataToValueMockFunc;

    beforeEach(() => {
      //10 corresponds to data of [1,2,3,4]
      value = 10;
      tickId = 123;

      //Creating mocking method for converting data to value
      //Data contains elements [1,2,3,4...]
      //Value contains the sum of all elements in array
      convertDataToValueMockFunc = jest.fn((data) => {
        let valueToReturn = 0;
        for (let value of data) valueToReturn += value;
        return valueToReturn;
      });

      convertValueToDataMockFunc = jest.fn((value) => {
        let dataToReturn = [];
        let index = 1;
        let restOfValue = value;
        while (restOfValue > 0) {
          dataToReturn.push(index);
          restOfValue -= index;
          index++;
        }
        return dataToReturn;
      });
    });

    let exec = async () => {
      variable = new ConnectableVariable();
      variable._convertDataToValue = convertDataToValueMockFunc;
      variable._convertValueToData = convertValueToDataMockFunc;
      variable.setValue(value, tickId);
    };

    it("should set new Value to variable and tickId", async () => {
      await exec();

      expect(variable.Value).toEqual(10);
      expect(variable.LastValueTick).toEqual(123);
    });

    it("should set Data based on converted variable", async () => {
      await exec();

      //10 corresponds to data of [1,2,3,4]
      expect(variable.Data).toEqual([1, 2, 3, 4]);
    });

    it("should call _convertValueToDataMockFunc in order to set Data based on Value", async () => {
      await exec();

      //ConvertDataToValue should have been called
      expect(convertValueToDataMockFunc).toHaveBeenCalledTimes(1);
      expect(convertValueToDataMockFunc.mock.calls[0][0]).toEqual(10);
    });
  });

  describe("setData", () => {
    let data;
    let tickId;
    let variable;
    let convertValueToDataMockFunc;
    let convertDataToValueMockFunc;

    beforeEach(() => {
      //[1,2,3,4] corresponds to 10
      data = [1, 2, 3, 4];
      tickId = 123;

      //Creating mocking method for converting data to value
      //Data contains elements [1,2,3,4...]
      //Value contains the sum of all elements in array
      convertDataToValueMockFunc = jest.fn((data) => {
        let valueToReturn = 0;
        for (let value of data) valueToReturn += value;
        return valueToReturn;
      });

      convertValueToDataMockFunc = jest.fn((value) => {
        let dataToReturn = [];
        let index = 1;
        let restOfValue = value;
        while (restOfValue > 0) {
          dataToReturn.push(index);
          restOfValue -= index;
          index++;
        }
        return dataToReturn;
      });
    });

    let exec = async () => {
      variable = new ConnectableVariable();
      variable._convertDataToValue = convertDataToValueMockFunc;
      variable._convertValueToData = convertValueToDataMockFunc;
      variable.setData(data, tickId);
    };

    it("should set new Data to Data and tickId", async () => {
      await exec();

      //10 corresponds to data of [1,2,3,4]
      expect(variable.Data).toEqual([1, 2, 3, 4]);
      expect(variable.LastValueTick).toEqual(123);
    });

    it("should return proper value based on data that has been set", async () => {
      await exec();

      expect(variable.Value).toEqual(10);
    });
  });
});
