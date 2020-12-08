const S7Request = require("../../Request/S7Request/S7Request");
const RequestManager = require("../RequestManager");

class S7RequestManager extends RequestManager {
  //#region ========= PUBLIC STATIC METHODS =========

  /**
   * @description Method for grouping S7Variables that can be represented as one S7Request. Returns a List of lists: List<List<S7Variable>> reperesenting groups of variable
   * @param {Array} variables Array of variables
   */
  static groupS7Variables(variables) {
    /*
     * creating variables object to group variables
     * {
     *      readGroup:
     *      {
     *            memoryType: {
     *
     *                  //If MemoryAreaType is DB
     *                  dbNumber:
     *                  {
     *                      sampleTime: [] <-- array containing all variables ordered by offset
     *                  }
     *
     *                  // Memory area type is not DB
     *                  sampleTime: [] <-- array containing all variables ordered by offset
     *
     *            }
     *      },
     *      writeGroup:
     *      {
     *            memoryType: {
     *
     *                  //If MemoryAreaType is DB
     *                  dbNumber:
     *                  {
     *                      sampleTime: [] <-- array containing all variables ordered by offset
     *                  }
     *
     *                  // Memory area type is not DB
     *                  sampleTime: [] <-- array containing all variables ordered by offset
     *
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
          let memoryType = variable.MemoryType;
          let sampleTime = variable.SampleTime;

          if (memoryType === "DB") {
            //for memory type of DB

            let dbNumber = variable.DBNumber;

            if (!variablesObject.read[memoryType])
              variablesObject.read[memoryType] = {};
            if (!variablesObject.read[memoryType][dbNumber])
              variablesObject.read[memoryType][dbNumber] = {};
            if (!variablesObject.read[memoryType][dbNumber][sampleTime])
              variablesObject.read[memoryType][dbNumber][sampleTime] = [];

            variablesObject.read[memoryType][dbNumber][sampleTime].push(
              variable
            );
            variablesObject.read[memoryType][dbNumber][sampleTime].sort(
              (var1, var2) => var1.Offset - var2.Offset
            );
          } else {
            //for memory type not DB

            if (!variablesObject.read[memoryType])
              variablesObject.read[memoryType] = {};
            if (!variablesObject.read[memoryType][sampleTime])
              variablesObject.read[memoryType][sampleTime] = [];

            variablesObject.read[memoryType][sampleTime].push(variable);
            variablesObject.read[memoryType][sampleTime].sort(
              (var1, var2) => var1.Offset - var2.Offset
            );
          }
        }
      }
      //#endregion variable for reading

      //#region variable for writing
      else if (variable.Write) {
        if (variable.WriteSeperately) {
          variablesObject.writeSeperately.push(variable);
        } else {
          let memoryType = variable.MemoryType;
          let sampleTime = variable.SampleTime;

          if (memoryType === "DB") {
            //for memory type of DB

            let dbNumber = variable.DBNumber;

            if (!variablesObject.write[memoryType])
              variablesObject.write[memoryType] = {};
            if (!variablesObject.write[memoryType][dbNumber])
              variablesObject.write[memoryType][dbNumber] = {};
            if (!variablesObject.write[memoryType][dbNumber][sampleTime])
              variablesObject.write[memoryType][dbNumber][sampleTime] = [];

            variablesObject.write[memoryType][dbNumber][sampleTime].push(
              variable
            );
            variablesObject.write[memoryType][dbNumber][sampleTime].sort(
              (var1, var2) => var1.Offset - var2.Offset
            );
          } else {
            //for memory type not DB

            if (!variablesObject.write[memoryType])
              variablesObject.write[memoryType] = {};
            if (!variablesObject.write[memoryType][sampleTime])
              variablesObject.write[memoryType][sampleTime] = [];

            variablesObject.write[memoryType][sampleTime].push(variable);
            variablesObject.write[memoryType][sampleTime].sort(
              (var1, var2) => var1.Offset - var2.Offset
            );
          }
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
    for (let memoryType of Object.keys(variablesObject.read)) {
      if (memoryType === "DB") {
        //for memory type DB

        for (let dbNumber of Object.keys(variablesObject.read[memoryType])) {
          for (let sampleTime of Object.keys(
            variablesObject.read[memoryType][dbNumber]
          )) {
            let group = [];
            let actualOffset = 0;

            //For each variable - create groups if there is a gap between offsets of variables
            let variablesLength =
              variablesObject.read[memoryType][dbNumber][sampleTime].length;
            for (let index = 0; index < variablesLength; index++) {
              let actualVariable =
                variablesObject.read[memoryType][dbNumber][sampleTime][index];

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
      } else {
        //for memory type not DB

        for (let sampleTime of Object.keys(variablesObject.read[memoryType])) {
          let group = [];
          let actualOffset = 0;

          //For each variable - create groups if there is a gap between offsets of variables
          let variablesLength =
            variablesObject.read[memoryType][sampleTime].length;
          for (let index = 0; index < variablesLength; index++) {
            let actualVariable =
              variablesObject.read[memoryType][sampleTime][index];

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
    for (let memoryType of Object.keys(variablesObject.write)) {
      if (memoryType === "DB") {
        //for memory type DB

        for (let dbNumber of Object.keys(variablesObject.write[memoryType])) {
          for (let sampleTime of Object.keys(
            variablesObject.write[memoryType][dbNumber]
          )) {
            let group = [];
            let actualOffset = 0;

            //For each variable - create groups if there is a gap between offsets of variables
            let variablesLength =
              variablesObject.write[memoryType][dbNumber][sampleTime].length;
            for (let index = 0; index < variablesLength; index++) {
              let actualVariable =
                variablesObject.write[memoryType][dbNumber][sampleTime][index];

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
      } else {
        //for memory type not DB

        for (let sampleTime of Object.keys(variablesObject.write[memoryType])) {
          let group = [];
          let actualOffset = 0;

          //For each variable - create groups if there is a gap between offsets of variables
          let variablesLength =
            variablesObject.write[memoryType][sampleTime].length;
          for (let index = 0; index < variablesLength; index++) {
            let actualVariable =
              variablesObject.write[memoryType][sampleTime][index];

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

    let groupedVariables = S7RequestManager.groupS7Variables(variables);

    for (let group of groupedVariables) {
      if (group.length > 0) {
        //Getting properties for request from first variable from group
        let sampleTime = group[0].SampleTime;
        let memoryType = group[0].MemoryType;
        let writeRequest = !group[0].Read;
        let dbNumber = memoryType === "DB" ? group[0].DBNumber : null;

        let request = new S7Request(
          group,
          sampleTime,
          writeRequest,
          memoryType,
          dbNumber
        );

        this.Requests.push(request);
      }
    }
  }

  //#endregion ========= OVERRIDE PUBLIC METHODS =========
}

module.exports = S7RequestManager;
