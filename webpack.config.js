const path = require('path');
const webpack = require('webpack');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const ROOT = path.resolve(__dirname, 'src');
const DESTINATION = path.resolve(__dirname, 'dist');

module.exports = {
  context: ROOT,

  entry: {
    main: './index.ts',
  },

  output: {
    filename: '[name].bundle.js',
    path: DESTINATION,
  },

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [ROOT, 'node_modules'],
  },

  module: {
    rules: [
      /****************
       * LOADERS
       *****************/
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

      {
        test: /a3api\.ts$/,
        loader: 'expose-loader',
        options: {
          exposes: 'A3API',
          // To access please use `window.A3API`
        },
      },

      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(svg)$/,
        type: 'asset/inline',
      },
      {
        test: /\.(woff2)$/,
        type: 'asset/inline',
      },
      {
        test: /\.(wav)$/,
        type: 'asset/inline',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
            },
          },
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlInlineScriptPlugin(),
    new HTMLInlineCSSWebpackPlugin(),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: true, verbose: true }),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      minify: true,
    }),
  ],

  devtool: 'cheap-module-source-map',
  devServer: {},
};
