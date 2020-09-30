const config = require("config");
const path = require("path");
const jwt = require("jsonwebtoken");
const {
  hashString,
  hashedStringMatch,
  exists,
  generateUniqId,
  readFileAsync,
  writeFileAsync,
  getBit,
  checkIfFileExistsAsync,
} = require("../../utilities/utilities");

const jwtPrivateKey = config.get("jwtPrivateKey");
const settingsDirPath = config.get("settingsPath");
const userFileName = config.get("userFileName");
const userFilePath = path.join(settingsDirPath, userFileName);

const getUsersFileContent = async () => {
  return JSON.parse(await readFileAsync(userFilePath, "utf8"));
};

const setUsersFileContent = async (fileContent) => {
  return writeFileAsync(userFilePath, JSON.stringify(fileContent), "utf8");
};

class User {
  /**
   * @description Class representing application user
   */
  constructor() {
    this._id = null;
    this._name = null;
    this._password = null;
    this._permissions = null;
  }

  /**
   * @description Method for checking if user name is unique
   * @param {String} name Name of user
   * @param {Array} ids Array of ids to except
   */
  static async _isUserNameUniqueExceptIds(name, ids = []) {
    let userObject = await getUsersFileContent();
    let allUsers = Object.values(userObject);

    if (
      allUsers.find((user) => {
        if (ids.includes(user._id)) return false;
        else return user.name === name;
      })
    )
      return false;
    else return true;
  }

  /**
   * @description Method for creating user from payload
   * @param {JSON} payload Payload of user
   * @param {Boolean} hashPassword Should password be hashed
   */
  static async CreateFromPayload(payload, hashPassword = true) {
    if (!exists(payload.name)) throw new Error(`"name" is required`);
    if (!exists(payload.permissions))
      throw new Error(`"permissions" is required`);
    if (!exists(payload.password)) throw new Error(`"password" is required`);

    let usersPayload = { ...payload };

    //Generating users id if doesn't exists
    if (!usersPayload._id) usersPayload._id = generateUniqId();

    let user = new User();
    await user.EditWithPayload(usersPayload, hashPassword);

    return user;
  }

  /**
   * @description Method for getting user from user file by id - returns null if there is no user of given id
   * @param {String} id ID of user
   */
  static async GetUserFromFileById(id) {
    let usersFileContent = await getUsersFileContent();

    if (!usersFileContent[id]) return null;

    return User.CreateFromPayload(usersFileContent[id], false);
  }

  /**
   * @description Method for getting user from user file by name - returns null if there is no user of given id
   * @param {String} name name of user
   */
  static async GetUserFromFileByName(name) {
    let usersFileContent = await getUsersFileContent();

    let allUsersPayload = Object.values(usersFileContent);

    let userWithName = allUsersPayload.find((user) => user.name === name);

    if (!userWithName) return null;

    return User.CreateFromPayload(userWithName, false);
  }

  /**
   * @description Method for getting all users from file
   */
  static async GetAllUsersFromFile() {
    let usersFileContent = await getUsersFileContent();

    return Object.values(usersFileContent).map((userPayload) =>
      CreateFromPayload(userPayload, false)
    );
  }

  /**
   * @description Method for deleting user from file content
   * @param {String} id id of user to delete
   */
  static async RemoveUserFromFile(id) {
    let usersFileContent = await getUsersFileContent();

    if (exists(usersFileContent[id])) delete usersFileContent[id];

    await setUsersFileContent(usersFileContent);
  }

  /**
   * @description Method for checking if user is super admin
   * @param {Number} permissions permissions to check
   */
  static isSuperAdmin = (permissions) => {
    return getBit(permissions, 2);
  };

  /**
   * @description Method for checking if user is admin
   * @param {Number} permissions permissions to check
   */
  static isAdmin = (permissions) => {
    return getBit(permissions, 1);
  };

  /**
   * @description Method for checking if user is user
   * @param {Number} permissions permissions to check
   */
  static isUser = (permissions) => {
    return getBit(permissions, 0);
  };

  /**
   * @description id of user
   */
  get ID() {
    return this._id;
  }

  /**
   * @description name of user
   */
  get Name() {
    return this._name;
  }

  /**
   * @description password of user (can be null if user was created from memory - only hashed password is presented)
   */
  get Password() {
    return this._password;
  }

  /**
   * @description users permissions
   */
  get Permissions() {
    return this._permissions;
  }

  /**
   * @description Payload of the user
   */
  get Payload() {
    return {
      _id: this.ID,
      name: this.Name,
      permissions: this.Permissions,
      password: this.Password,
    };
  }

  /**
   * @description Payload of the user without password
   */
  get PayloadWithoutPassword() {
    let payload = this.Payload;
    delete payload.password;

    return payload;
  }

  /**
   * @description Method for generating JWT token of user
   */
  async generateJWT() {
    return jwt.sign(this.PayloadWithoutPassword, jwtPrivateKey);
  }

  /**
   * @description Save client to file
   */
  async Save() {
    //Checking content of payload to save
    let payload = this.Payload;
    if (!exists(payload._id)) throw new Error(`"_id" is required`);
    if (!exists(payload.name)) throw new Error(`"name" is required`);
    if (!exists(payload.permissions))
      throw new Error(`"permissions" is required`);
    if (!exists(payload.password)) throw new Error(`"password" is required`);

    //Checking if name is unique - except currently checked user with given id
    if (!(await User._isUserNameUniqueExceptIds(payload.name, [payload._id])))
      throw new Error(`User's name ${payload.name} already exists!`);

    let allUsersObject = await getUsersFileContent();

    let usersCurrentPayload = allUsersObject[this.ID];

    //If updating exisiting user - checking if there is an attempt to change name or id
    if (exists(usersCurrentPayload)) {
      if (usersCurrentPayload.name !== payload.name)
        throw new Error(
          `Name ${payload.name} does not correspond to users name ${usersCurrentPayload.name}`
        );

      if (usersCurrentPayload._id !== payload._id)
        throw new Error(
          `ID ${payload._id} does not correspond to users id ${usersCurrentPayload._id}`
        );
    }

    //Update users object with new payload
    allUsersObject[payload._id] = payload;

    //Save payload to file
    return setUsersFileContent(allUsersObject, true);
  }

  /**
   * @description Method for editing user with payload
   * @param {JSON} payload Payload of user to edit
   * @param {String} hashPassword Should password be hashed
   */
  async EditWithPayload(payload, hashPassword = true) {
    if (exists(payload._id)) {
      //Edit name id if it is null - otherwise throw if there id is diff then actual id
      if (!this.ID) this._id = payload._id;
      else if (this.ID !== payload._id)
        throw new Error(
          `ID ${payload._id} does not correspond to users id ${this.ID}`
        );
    }

    if (exists(payload.name)) {
      //Edit name only if it is null - otherwise throw if there name is diff then actual name
      if (!this.Name) this._name = payload.name;
      else if (this.Name !== payload.name)
        throw new Error(
          `Name ${payload.name} does not correspond to users name ${this.Name}`
        );
    }

    if (exists(payload.permissions)) this._permissions = payload.permissions;
    if (exists(payload.password)) {
      if (hashPassword) this._password = await hashString(payload.password);
      else this._password = payload.password;
    }
  }
}

module.exports = User;
