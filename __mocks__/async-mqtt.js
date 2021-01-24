const { snooze } = require("../utilities/utilities");

const mockConnectDelay = 10;
//Normally, if there is not internet connection, publish should hang until internet reconnects. For testing - setting just long time
const publishEndsOnLackOfInternetTime = 10000;

let internetConnection = true;

class MockClient {
  constructor(url, connectionParameters) {
    this.mockPublishDelay = 10;
    this.mockUrl = url;
    this.mockConnectionParams = connectionParameters;
    this.mockConnected = true;
  }

  get connected() {
    return this.mockConnected;
  }

  publish = jest.fn(async (topic, command, params) => {
    if (params && params.qos && params.qos > 0) {
      if (internetConnection) return;
      else {
        //no internet connection and qos requries response from server - simulate publish hang

        await snooze(publishEndsOnLackOfInternetTime);
        return;
      }
    }

    //QoS not send or send to 0 - return immediately even if there is no internet connection
    return;
  });

  end = jest.fn(async () => {
    await snooze(this.mockPublishDelay);
    this.mockConnected = false;
  });
}

module.exports.MockClient = MockClient;

module.exports.connectAsync = jest.fn(async (url, connectionParams) => {
  await snooze(mockConnectDelay);

  //throwing if there is no internet connection
  if (!internetConnection)
    throw new Error("Cannot connect - no internet connection");

  //If there is an internet connection - return connected client
  return new MockClient(url, connectionParams);
});

/**
 * @description Mock method to set internet connection state
 * @param {boolean} connection new internet connection state
 */
module.exports.mockSetInternetConnection = function (connection) {
  internetConnection = connection;
};
