const webpack = require("webpack");
const express = require("express");
const webpackDevMiddleware = require("webpack-dev-middleware");
const devConfig = require("../const/webpack.dev.js");

module.exports = function(options) {
  const { port = 3000 } = options;
  //   console.log(devConfig);
  const compiler = webpack(devConfig);
  const app = express();
  app.use(
    webpackDevMiddleware(compiler, {
      // webpack-dev-middleware options
    })
  );
  // /eslint-disable-next-line
  app.listen(port, () => console.log(`App listening on port ${port}!`));
};
