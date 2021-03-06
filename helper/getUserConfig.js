const fs = require('fs');
const path = require('path');

const configFilePath = path.resolve(process.cwd(), 'f6d.config.js');
const isConfigExists = fs.existsSync(configFilePath);

module.exports = function() {
    const dfc = {
        port: 3000,
        webpackConfig: {
            jsLoaderIncludePkg: [],
            resolve: {},
            useAntd: false,
            bundleAnalyzer: false,
            publicPath: '/',
            optimization: null,
            splitChunksQuickly: [],
            svgLoader: null,
        },
    };
    if (isConfigExists) {
        return { ...dfc, ...require(configFilePath) };
    }
    return dfc;
};
