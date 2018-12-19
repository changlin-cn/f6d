const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const visualizer = require('webpack-visualizer-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "static/[name].[chunkhash].js",
    path: path.resolve(process.cwd(), "dist"),
    chunkFilename: 'static/[name].[chunkhash].js'
  },
  plugins: [
    new CleanWebpackPlugin(["dist"], { root: process.cwd() }),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: "sha256",
      hashDigest: "hex",
      hashDigestLength: 20
    }),
    new visualizer({
      filename: "visualizer.html"
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/[name].[chunkhash].css',
      chunkFilename: 'static/[id].[chunkhash].css',
    })
  ],
  node: {
    process: true
  }
});
