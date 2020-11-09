const StandardProtocolVariable = require("../StandardProtocolVariable");

class S7Variable extends StandardProtocolVariable {
  //#region ========= CONSTRUCTOR =========

  constructor(project, device) {
    super(project, device);
  }

  //#endregion ========= CONSTRUCTOR =========
}

module.exports = S7Variable;
