const User = require("./classes/User/User");

let exec = async () => {
  let payload = {
    name: "testUser6",
    password: "abcd1234",
    permissions: 3,
  };

  let newUser = await User.CreateFromPayload(payload);

  await newUser.Save();

  let user = await User.GetUserFromFileByName("testUser5");

  console.log(user);

  //   await newUser.Save();
};

exec();
