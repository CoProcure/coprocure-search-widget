const webpack = require("webpack");
const path = require("path");

const config = {
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          'template-string-loader'
        ],
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader"
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
            options: {
              sourceMap: false
            }
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              sourceMap: false
            }
          },
          {
            loader: "sass-loader", // compiles Sass to CSS
            options: {
              sourceMap: false
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // webcomponents-lite.js breaks webpack build because of missing dependency that isn't needed
    new webpack.IgnorePlugin(/vertx/)
  ]
};

const build = Object.assign({}, config, {
  entry: {
    index: "./src/index.js"
  },
  output: {
    filename: "[name].js"
  },
  devServer: {
    openPage: "dev.html",
    contentBase: path.resolve(__dirname, "."),
    compress: true,
    port: 3000,
    publicPath: "/dist/"
  }
});

module.exports = [build];
