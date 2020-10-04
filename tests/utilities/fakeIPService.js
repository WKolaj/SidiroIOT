const http = require("http");
let _content = [];
let _httpServer = null;
const testSocketFilePath = "__testDir/netplan/data.socket";

module.exports._setContent = (newContent) => {
  _content = newContent;
};

module.exports.OnGetMockFn = jest.fn();
module.exports.OnPostMockFn = jest.fn();

module.exports.Start = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      _httpServer = http.createServer(function (request, response) {
        let content = "";
        //On every piece of data - extend content
        request.on("data", (buf) => {
          content += buf.toString();
        });

        //Handling error during communication
        request.on("error", () => {
          return reject("Error during communication");
        });

        //On stream end - invoke data input change
        request.on("end", async () => {
          //Invoking data input handler - based on method
          if (request.method === "POST") {
            module.exports.OnPostMockFn(request, content);
            _content = JSON.parse(content);
            response.statusCode = 200;
            return response.end(JSON.stringify(_content));
          } else if (request.method === "GET") {
            module.exports.OnGetMockFn(request);
            response.statusCode = 200;
            response.setHeader("content-type", "application/json");
            return response.end(JSON.stringify(_content));
          } else {
            response.statusCode = 400;
            return response.end("invalid http function");
          }
        });
      });

      _httpServer.listen(testSocketFilePath, () => {
        return resolve();
      });
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * @description Method for stopping inter process communication
 */
module.exports.Stop = async () => {
  return new Promise(async (resolve, reject) => {
    if (_httpServer) {
      _httpServer.close((err) => {
        if (err) return reject(err);
        else return resolve();
      });
    }
  });
};
