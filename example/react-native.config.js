const path = require("node:path");

// The module under test lives one directory up (this is its example app).
// Point React Native / Expo autolinking at it directly instead of declaring a
// package-manager dependency: a `file:..` dependency makes Bun recursively copy
// the whole repo (which contains this example) into node_modules until the path
// length overflows. The postinstall symlink handles Metro/JS resolution.
module.exports = {
  dependencies: {
    "expo-facebook-analytics": {
      root: path.resolve(__dirname, ".."),
    },
  },
};
