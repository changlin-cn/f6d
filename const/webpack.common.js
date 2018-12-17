const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// const webpack = require("webpack");



module.exports = {
  entry: "./src/index.js",
  resolve: {
    modules: [path.resolve(process.cwd(), 'src'), 'node_modules']
  },
  output: {
    filename: "[name].js",
    path: path.resolve(process.cwd(), "dist")
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              require.resolve("@babel/preset-env"),
              require.resolve("@babel/preset-react"),
            ],
            plugins: [
              require.resolve("@babel/plugin-transform-runtime"),
              require.resolve("@babel/plugin-syntax-dynamic-import"),
              require.resolve("@babel/plugin-proposal-class-properties")
            ]
          }
        }
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
            }
          }
        ]
      },
      {
        test: /\.s(c|a)ss$/,
        use:[
          MiniCssExtractPlugin.loader,
          // require.resolve("style-loader"),
          require.resolve("css-loader"), // translates CSS into CommonJS
          require.resolve("sass-loader") // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  },
  optimization: {
    runtimeChunk: {
      name: "runtime"
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), "src/index.html")
    })
  ]
};
