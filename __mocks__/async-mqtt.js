const { snooze } = require("../utilities/utilities");

const mockConnectDelay = 10;

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

  publish = jest.fn();

  end = jest.fn(async () => {
    await snooze(this.mockPublishDelay);
    this.connected = false;
  });
}

module.exports.connectAsync = jest.fn(async (url, connectionParams) => {
  await snooze(mockConnectDelay);
  return new MockClient(url, connectionParams);
});
