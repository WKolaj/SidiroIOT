const FileStorage = require("./classes/Storage/FileStorage");
const { snooze } = require("./utilities/utilities");

let storage = new FileStorage();

let exec = async () => {
  try {
    await storage.init({
      bufferLength: 10,
      dirPath: `/home/wk/Documents/Projects/SidiroIOT/__testDir/fileStorage`,
    });

    // for (let i = 0; i < 20; i++) {
    //   let payload = { data: i };
    //   await storage.createData(payload);
    // }

    for (let id of await storage.getAllIDs()) {
      console.log(await storage.getData(id));
    }

    console.log("done");
  } catch (err) {
    console.log(err);
  }
};

exec();
