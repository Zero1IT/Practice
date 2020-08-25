const path = require("path");

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: "./app.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "../src/main/webapp/resources/js")
    }
};
