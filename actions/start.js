const webpack = require('webpack');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const getUserConfig = require('../helper/getUserConfig');
const getWebpackConfig = require('../helper/getWebpackConfig');

module.exports = function(commandConfig) {
    const _config = { ...getUserConfig(), ...commandConfig };
    const { port } = _config;
    //   console.log(devConfig);
    const devConfig = getWebpackConfig('dev');
    const compiler = webpack(devConfig);
    const app = express();
    const wd_middleware = webpackDevMiddleware(compiler, {
        // webpack-dev-middleware options
    });
    app.use(function(req, res, next) {
        console.log(`req.url:${req.url}`);
        next();
    });

    app.use(wd_middleware);
    // 404
    app.use(compiler.options.publicPath || '/', function(req, res, next) {
        wd_middleware(
            { ...req, url: compiler.options.publicPath || '/' },
            res,
            next,
        );
    });

    // eslint-disable-next-line
    app.listen(port, () => console.log(`App listening on port ${port}!`));
};
