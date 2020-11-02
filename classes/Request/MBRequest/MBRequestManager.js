const MBRequest = require("../../Request/MBRequest/MBRequest");
const RequestManager = require("../RequestManager");

class MBRequestManager extends RequestManager {
  //#region ========= PUBLIC STATIC METHODS =========

  /**
   * @description Method for grouping MBVariables that can be represented as one MBRequest. Returns a List of lists: List<List<MBVariable>> reperesenting groups of variable
   * @param {Array} variables Array of variables
   */
  static groupMBVariables(variables) {
    /*
     * creating variables object to group variables
     * {
     *      readGroup:
     *      {
     *            unitID: {
     *
     *                  fCode:
     *                  {
     *                      sampleTime: [] <-- array containing all variables ordered by offset
     *                  }
     *
     *            }
     *      },
     *      writeGroup:
     *      {
     *            unitID: {
     *
     *                  fCode:
     *                  {
     *                      sampleTime: [] <-- array containing all variables ordered by offset
     *                  }
     *            }
     *      }
     *      readSeperately: [] <-- array containing all variables that should be read seperately
     *      writeSeperately: [] <-- array containing all variables that should be write seperately
     * }
     *
     */

    let variablesObject = {
      read: {},
      write: {},
      readSeperately: [],
      writeSeperately: [],
    };

    for (let variable of variables) {
      //#region variable for reading
      if (variable.Read) {
        if (variable.ReadSeperately) {
          variablesObject.readSeperately.push(variable);
        } else {
          let unitID = variable.UnitID;
          let fCode = variable.ReadFCode;
          let sampleTime = variable.SampleTime;

          if (!variablesObject.read[unitID]) variablesObject.read[unitID] = {};
          if (!variablesObject.read[unitID][fCode])
            variablesObject.read[unitID][fCode] = {};
          if (!variablesObject.read[unitID][fCode][sampleTime])
            variablesObject.read[unitID][fCode][sampleTime] = [];

          variablesObject.read[unitID][fCode][sampleTime].push(variable);
          variablesObject.read[unitID][fCode][sampleTime].sort(
            (var1, var2) => var1.Offset - var2.Offset
          );
        }
      }
      //#endregion variable for reading

      //#region variable for writing
      else if (variable.Write) {
        if (variable.WriteSeperately) {
          variablesObject.writeSeperately.push(variable);
        } else {
          let unitID = variable.UnitID;
          let fCode = variable.WriteFCode;
          let sampleTime = variable.SampleTime;

          if (!variablesObject.write[unitID])
            variablesObject.write[unitID] = {};
          if (!variablesObject.write[unitID][fCode])
            variablesObject.write[unitID][fCode] = {};
          if (!variablesObject.write[unitID][fCode][sampleTime])
            variablesObject.write[unitID][fCode][sampleTime] = [];

          variablesObject.write[unitID][fCode][sampleTime].push(variable);
          variablesObject.write[unitID][fCode][sampleTime].sort(
            (var1, var2) => var1.Offset - var2.Offset
          );
        }
      }
      //#endregion variable for writing
    }

    let allGroups = [];

    //Creating groups for all single read variables
    for (let variable of variablesObject.readSeperately) {
      let group = [variable];
      allGroups.push(group);
    }

    //Creating groups for all single write variables
    for (let variable of variablesObject.writeSeperately) {
      let group = [variable];
      allGroups.push(group);
    }
    //Creating groups for all read variables
    for (let unitID of Object.keys(variablesObject.read)) {
      for (let fCode of Object.keys(variablesObject.read[unitID])) {
        for (let sampleTime of Object.keys(
          variablesObject.read[unitID][fCode]
        )) {
          let group = [];
          let actualOffset = 0;

          //For each variable - create groups if there is a gap between offsets of variables
          let variablesLength =
            variablesObject.read[unitID][fCode][sampleTime].length;
          for (let index = 0; index < variablesLength; index++) {
            let actualVariable =
              variablesObject.read[unitID][fCode][sampleTime][index];

            //For first variable - actual offset should be initialized
            if (index === 0) {
              group.push(actualVariable);
              actualOffset = actualVariable.Offset + actualVariable.Length;
            } else {
              //For other variables - if there is a gap - assign old group to allGroups and create new one
              //Added > sign - if variable is overlapped it should also be in this group
              if (actualVariable.Offset > actualOffset) {
                allGroups.push(group);
                group = [actualVariable];
                actualOffset = actualVariable.Offset + actualVariable.Length;
              } else {
                group.push(actualVariable);
                //if actualOffset is longer than variable length + actualVariableOffset (overlapped shorter variable inside longer one)
                let newOffset = actualVariable.Offset + actualVariable.Length;
                if (newOffset > actualOffset) actualOffset = newOffset;
              }
            }

            //For last variable - actual groups should be pushed to all groups
            if (index === variablesLength - 1) {
              allGroups.push(group);
            }
          }
        }
      }
    }

    //Creating groups for all write variables
    for (let unitID of Object.keys(variablesObject.write)) {
      for (let fCode of Object.keys(variablesObject.write[unitID])) {
        for (let sampleTime of Object.keys(
          variablesObject.write[unitID][fCode]
        )) {
          let group = [];
          let actualOffset = 0;

          //For each variable - create groups if there is a gap between offsets of variables
          let variablesLength =
            variablesObject.write[unitID][fCode][sampleTime].length;
          for (let index = 0; index < variablesLength; index++) {
            let actualVariable =
              variablesObject.write[unitID][fCode][sampleTime][index];

            //For first variable - actual offset should be initialized
            if (index === 0) {
              group.push(actualVariable);
              actualOffset = actualVariable.Offset + actualVariable.Length;
            } else {
              //For other variables - if there is a gap - assign old group to allGroups and create new one
              //Added > sign - if variable is overlapped it should also be in this group
              if (actualVariable.Offset > actualOffset) {
                allGroups.push(group);
                group = [actualVariable];
                actualOffset = actualVariable.Offset + actualVariable.Length;
              } else {
                group.push(actualVariable);
                //if actualOffset is longer than variable length + actualVariableOffset (overlapped shorter variable inside longer one)
                let newOffset = actualVariable.Offset + actualVariable.Length;
                if (newOffset > actualOffset) actualOffset = newOffset;
              }
            }

            //For last variable - actual groups should be pushed to all groups
            if (index === variablesLength - 1) {
              allGroups.push(group);
            }
          }
        }
      }
    }

    return allGroups;
  }

  //#endregion ========= PUBLIC STATIC METHODS =========

  //#region ========= OVERRIDE PUBLIC METHODS =========

  /**
   * @description Method for creating requests out of collection of variables.
   * @param {Array} variables collection of variable to create request from
   */
  async createRequests(variables) {
    this._requests = [];

    let groupedVariables = MBRequestManager.groupMBVariables(variables);

    for (let group of groupedVariables) {
      if (group.length > 0) {
        //Getting properties for request from first variable from group
        let sampleTime = group[0].SampleTime;
        let unitID = group[0].UnitID;
        let writeRequest = !group[0].Read;
        let fCode = writeRequest ? group[0].WriteFCode : ReadFCode;

        let request = new MBRequest(
          group,
          sampleTime,
          writeRequest,
          fCode,
          unitID
        );

        this.Requests.push(request);
      }
    }
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

//TODO - test createRequest method

module.exports = MBRequestManager;
