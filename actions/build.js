const webpack = require("webpack");
const prdConfig = require("../const/webpack.prd.js");

module.exports = function() {
  const compiler = webpack(prdConfig)
compiler.run((err, stats) => {
  if (err || stats.hasErrors()) {
    // Handle errors here
    // eslint-disable-next-line
    console.log(err);
  }
  // eslint-disable-next-line
  console.log(stats.toString({
    chunks: false,  // Makes the build much quieter
    colors: true    // Shows colors in the console
  }));
  // Done processing
})
};
