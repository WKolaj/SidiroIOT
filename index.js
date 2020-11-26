const DataClipboard = require("./classes/Clipboard/DataClipboard");

let clipboard = new DataClipboard();

let exec = async () => {
  try {
    clipboard.init();

    for (let i = 100; i < 110; i++) {
      for (let j = 0; j < 10; j++) {
        let elementId = "testElement" + j;
        let elementValue = j * i + 123;
        let tickId = i;

        clipboard.addData(tickId, elementId, elementValue);
      }
    }

    console.log("done");

    console.log(clipboard.getAllData());
    clipboard.clearAllData();
    console.log(clipboard.getAllData());
  } catch (err) {
    console.log(err);
  }
};

exec();
