const path = require('path');
const webpack = require('webpack');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');



const ROOT = path.resolve( __dirname, 'src' );
const DESTINATION = path.resolve( __dirname, 'dist' );

var configCommon = {
    context: ROOT,

    entry: {
        'main': './index.ts'
    },
    
    output: {
        filename: 'bundle.js',
        path: DESTINATION,
        clean: true
    },

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            ROOT,
            'node_modules'
        ]
    },

    cache: { type: 'filesystem' },

    target: "web",

    module: {
        rules: [
            /****************
            * LOADERS
            *****************/
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },

            {
                test: /a3api\.ts$/,
                loader: "expose-loader",
                options: {
                  exposes: "A3API",
                  // To access please use `window.A3API`
                },
            },

            {
                test: /\.css$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  "css-loader"
                ]
            },
            {
                test: /\.svg$/,
                loader: 'url-loader'
            }
        ]
    },

    optimization:{
        minimize: false
    },

    devtool: 'inline-source-map',
    //devtool: 'cheap-module-source-map',
    devServer: {}
}

var configJS = Object.assign({}, configCommon, {
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
});

var configJSA3API = Object.assign({}, configCommon, {
    entry: {
        'main': './A3API.ts'
    },
    output: {
        filename: 'a3api.js',
        path: DESTINATION
    },
});

var configHTML = Object.assign({}, configCommon, {
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new HtmlInlineScriptPlugin(),
        new HTMLInlineCSSWebpackPlugin(),
        new CleanWebpackPlugin({cleanStaleWebpackAssets: true, verbose: true}),
        new HtmlWebpackPlugin({
            template: "./index.html",
            inject: true,
            minify: false,
            cache: false
        }),
    ],

    watch: true
});

module.exports = [/*configJS,*/ configHTML/*, configJSA3API*/];