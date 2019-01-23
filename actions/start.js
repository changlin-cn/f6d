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
    const baseURL = devConfig.output.publicPath || '/';
    // console.log('compiler.options.publicPath:'+compiler.options.publicPath) undefined
    const app = express();
    const wd_middleware = webpackDevMiddleware(compiler, {
        // webpack-dev-middleware options
        publicPath: baseURL,
    });
    app.use(
        require('webpack-hot-middleware')(compiler, {
            path: '/__webpack_hmr',
            heartbeat: 2000,
        }),
    );
    app.use(function(req, res, next) {
        console.log(`req.url:${req.url}`);
        next();
    });

    app.use(wd_middleware);
    // 404
    app.use(baseURL, function(req, res, next) {
        wd_middleware({ ...req, url: baseURL }, res, next);
    });

    // eslint-disable-next-line
    app.listen(port, () => console.log(`App listening on port ${port}!`));
};
