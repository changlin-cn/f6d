const webpack = require('webpack');
const prdConfig = require('../helper/getWebpackConfig')('prd');

module.exports = function() {
    const compiler = webpack(prdConfig);
    compiler.run((err, stats) => {
        // eslint-disable-next-line
        console.log(
            stats.toString({
                chunks: false, // Makes the build much quieter
                colors: true, // Shows colors in the console
            }),
        );

        if (err || stats.hasErrors()) {
            // Handle errors here
            // eslint-disable-next-line
            console.log(err);

            process.exitCode = 1;
        }

        // Done processing
    });
};
