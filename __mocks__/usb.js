let attachHandler = null;

const on = jest.fn((method, handler) => {
  switch (method) {
    case "attach": {
      attachHandler = handler;
    }
  }
});

const removeListener = jest.fn((method, handler) => {
  switch (method) {
    case "attach": {
      attachHandler = null;
    }
  }
});

const _invokeOnAttach = async () => {
  if (attachHandler) await attachHandler();
};

module.exports.on = on;
module.exports.removeListener = removeListener;
module.exports._invokeOnAttach = _invokeOnAttach;
