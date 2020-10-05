const http = require("http");
const Joi = require("joi");
let _content = [];
let _httpServer = null;
const testSocketFilePath = "__testDir/netplan/data.socket";

/**
 * @description Schema for ipV4 withouth cidr
 */
const ipV4Schema = Joi.string().ip({
  version: ["ipv4"],
  cidr: "forbidden",
});

/**
 * @description Schema for netplan interface configuration
 */
const NetplanInterfaceConfigurationSchema = Joi.object({
  name: Joi.string().min(1).required(),
  optional: Joi.boolean().required(),
  dhcp: Joi.boolean().required(),
  ipAddress: Joi.any().when("dhcp", {
    is: true,
    then: ipV4Schema.optional(),
    otherwise: ipV4Schema.required(),
  }),
  subnetMask: Joi.any().when("dhcp", {
    is: true,
    then: ipV4Schema.optional(),
    otherwise: ipV4Schema.required(),
  }),
  gateway: Joi.any().when("dhcp", {
    is: true,
    then: ipV4Schema.optional(),
    otherwise: ipV4Schema.required(),
  }),
  dns: Joi.any().when("dhcp", {
    is: true,
    then: Joi.array().items(ipV4Schema).optional(),
    otherwise: Joi.array().items(ipV4Schema).required(),
  }),
});

const postBodySchema = Joi.array().items(NetplanInterfaceConfigurationSchema);

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
            let parsedContent = JSON.parse(content);
            let validationResult = postBodySchema.validate(parsedContent);
            if (validationResult.error) {
              response.statusCode = 400;
              return response.end(validationResult.error.message);
            }

            module.exports.OnPostMockFn(request, content);

            _content = parsedContent;
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
        else {
          _httpServer = null;
          return resolve();
        }
      });
    } else {
      return resolve();
    }
  });
};
