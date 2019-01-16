const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const visualizer = require('webpack-visualizer-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const getUserConfig = require('./getUserConfig');

// const webpack = require("webpack");
function createStyleLoader(type = 'less') {
    const isLess = type === 'less';
    return {
        test: isLess ? /\.(le|c)ss$/ : /\.s(c|a)ss$/,
        use: [
            MiniCssExtractPlugin.loader,
            // require.resolve("style-loader"),
            require.resolve('css-loader'), // translates CSS into CommonJS
            {
                loader: require.resolve('postcss-loader'),
                options: {
                    plugins: [
                        require('autoprefixer')({
                            browsers: ['> 1%', 'IE 9', 'Android >= 4'],
                        }),
                    ],
                },
            },
            isLess
                ? {
                      loader: require.resolve('less-loader'),
                      options: { javascriptEnabled: true },
                  }
                : require.resolve('sass-loader'), // compiles Sass to CSS, using Node Sass by default
        ],
    };
}

module.exports = (env) => {
    const { webpackConfig = {} } = getUserConfig();
    const { jsLoaderIncludePkg = [], resolve = {} } = webpackConfig;

    const commonConfig = {
        entry: './src/index.js',
        resolve: {
            modules: [path.resolve(process.cwd(), 'src'), 'node_modules'],
        },
        output: {
            filename: '[name].js',
            path: path.resolve(process.cwd(), 'dist'),
            chunkFilename: 'static/[name].js',
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: new RegExp(
                        `node_modules/${
                            jsLoaderIncludePkg.length
                                ? `(?!${jsLoaderIncludePkg.join('|')})`
                                : ''
                        }`,
                    ),
                    use: {
                        loader: require.resolve('babel-loader'),
                        options: {
                            presets: [
                                require.resolve('@babel/preset-env'),
                                require.resolve('@babel/preset-react'),
                            ],
                            plugins: [
                                require.resolve(
                                    '@babel/plugin-transform-runtime',
                                ),
                                require.resolve(
                                    '@babel/plugin-syntax-dynamic-import',
                                ),
                                require.resolve(
                                    '@babel/plugin-proposal-class-properties',
                                ),
                                require.resolve('babel-plugin-lodash'),
                            ],
                        },
                    },
                },
                {
                    test: /\.(jpg|png|jpeg|gif)$/i,
                    use: [
                        {
                            loader: require.resolve('url-loader'),
                            options: {
                                limit: 8192,
                                context: path.resolve(process.cwd(), 'src'),
                                name: 'static/assets/[name].[hash].[ext]',
                            },
                        },
                    ],
                },
                createStyleLoader(),
                createStyleLoader('sass'),
            ],
        },
        optimization: {
            runtimeChunk: {
                name: 'runtime',
            },
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            },
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(process.cwd(), 'src/index.html'),
            }),
            new LodashModuleReplacementPlugin(),
        ],
    };

    if (env === 'dev') {
        return merge(commonConfig, {
            mode: 'development',
            devtool: 'inline-source-map',
            resolve,
            optimization: {
                minimize: false,
                namedModules: true,
            },
            plugins: [
                new MiniCssExtractPlugin({
                    // Options similar to the same options in webpackOptions.output
                    // both options are optional
                    filename: '[name].css',
                    chunkFilename: '[id].css',
                }),
            ],
        });
    }

    if (env === 'prd') {
        return merge(commonConfig, {
            mode: 'production',
            resolve,
            output: {
                filename: 'static/[name].[chunkhash].js',
                path: path.resolve(process.cwd(), 'dist'),
                chunkFilename: 'static/[name].[chunkhash].js',
            },
            plugins: [
                new CleanWebpackPlugin(['dist'], { root: process.cwd() }),
                new webpack.HashedModuleIdsPlugin({
                    hashFunction: 'sha256',
                    hashDigest: 'hex',
                    hashDigestLength: 20,
                }),
                new visualizer({
                    filename: 'visualizer.html',
                }),
                new MiniCssExtractPlugin({
                    // Options similar to the same options in webpackOptions.output
                    // both options are optional
                    filename: 'static/[name].[chunkhash].css',
                    chunkFilename: 'static/[id].[chunkhash].css',
                }),
            ],
            node: {
                process: true,
            },
        });
    }
};
