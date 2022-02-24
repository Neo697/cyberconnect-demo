import { Platform, LogBox } from "react-native";
import * as encoding from "text-encoding";

export interface Global {
  btoa: any;
  atob: any;
  self: any;
  Buffer: any;
  process: any;
  location: any;
  navigator: any;
  TextDecoder: any;
}

declare var global: Global;
if (typeof global.self === "undefined") {
  global.self = global;
}

if (Platform.OS !== "web") {
  require("react-native-get-random-values");
  LogBox.ignoreLogs([
    "Warning: The provided value 'ms-stream' is not a valid 'responseType'.",
    "Warning: The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
  ]);
}

global.btoa = global.btoa || require("base-64").encode;
global.atob = global.atob || require("base-64").decode;

global.Buffer = require("buffer").Buffer;

global.process = require("process");
global.process.env.NODE_ENV = __DEV__ ? "development" : "production";
global.process.version = "v9.40";

global.location = {
  protocol: "https",
};

if (!global.navigator || !global.navigator.userAgent) {
  global.navigator = {
    userAgent: "react-native",
  };
}

if (!global.TextDecoder) {
  global.TextDecoder = encoding.TextDecoder;
}
