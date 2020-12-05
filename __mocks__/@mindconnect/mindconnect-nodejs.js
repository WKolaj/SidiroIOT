const { snooze, existsAndIsNotEmpty } = require("../../utilities/utilities");

let internalDelay = 10;

class MindConnectAgent {
  constructor(credentials) {
    this._validateCredentials(credentials);
    this._credentials = credentials;
    this._onBoarded = false;
    this._hasDataSourceConfig = false;

    this.BulkPostData = jest.fn(async (dataToSend, validation) => {
      await snooze(internalDelay);
      return;
    });

    this.PostEvent = jest.fn(async (event) => {
      await snooze(internalDelay);
      return;
    });

    this.IsOnBoarded = jest.fn(() => {
      return this._onBoarded;
    });

    this.HasDataSourceConfiguration = jest.fn(() => {
      return this._hasDataSourceConfig;
    });

    this.OnBoard = jest.fn(async () => {
      await snooze(internalDelay);
      this._onBoarded = true;
    });

    this.GetDataSourceConfiguration = jest.fn(async () => {
      await snooze(internalDelay);
      this._hasDataSourceConfig = true;
    });
  }

  _validateCredentials(credentials) {
    if (!existsAndIsNotEmpty(credentials.content))
      throw new Error("content cannot be empty");

    if (!existsAndIsNotEmpty(credentials.content.baseUrl))
      throw new Error("content.baseUrl cannot be empty");

    if (!existsAndIsNotEmpty(credentials.content.iat))
      throw new Error("content.iat cannot be empty");

    if (!existsAndIsNotEmpty(credentials.content.clientCredentialProfile))
      throw new Error("content.clientCredentialProfile cannot be empty");

    if (!existsAndIsNotEmpty(credentials.content.clientId))
      throw new Error("content.clientId cannot be empty");

    if (!existsAndIsNotEmpty(credentials.content.tenant))
      throw new Error("content.tenant cannot be empty");

    if (!existsAndIsNotEmpty(credentials.expiration))
      throw new Error("expiration cannot be empty");
  }
}

let retry = jest.fn(async (count, func) => {
  let index = 0;

  while (index < count) {
    try {
      await func();
      return;
    } catch (err) {
      index++;
      if (index >= count) throw err;
    }
  }
});

module.exports.MindConnectAgent = MindConnectAgent;
module.exports.retry = retry;
module.exports._setDelayInModule = function (delay) {
  internalDelay = delay;
};
