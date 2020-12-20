const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const util = require("./util");
module.exports = {
  entry: {
    "aja-sdk": util.getEntryMain("src/aja-sdk/index.ts"),
    "utils": util.getEntryMain("src/utils/index.ts"),
    "html-ast": util.getEntryMain("src/html-ast/index.ts"),
    "mobx": util.getEntryMain("src/mobx/index.ts"),
  },
  output: {
    filename: "[name].js",
    path: util.getOutputPath(),
    library: "aja-sdk",
    libraryTarget: "umd",
    globalObject: "this",
  },
  rules: [
    {
      // See also: https://github.com/microsoft/TypeScript-Babel-Starter
      test: /\.tsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: "ts-loader",
      },
    },
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      ...util.parseTsConfigPaths(),
    },
  },
  plugins: [new CleanWebpackPlugin()],
  experiments: {
    topLevelAwait: true,
  },
};
