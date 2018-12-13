const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "[name].[chunkhash].js",
    path: path.resolve(process.cwd(), "dist")
  },
  plugins: [
    new CleanWebpackPlugin([ "dist"],{root:process.cwd()}),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: "sha256",
      hashDigest: "hex",
      hashDigestLength: 20
    })
  ],
  node: {
    process: true
  }
});
