"use strict";

const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const process = require("process");
const HtmlWebpackPlugin = require("simple-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
require("@babel/polyfill");

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

const isWatchDevelopment = isDevelopment;

const postCssOptions = {
    plugins: [autoprefixer({browsers: ["last 2 versions"]})]
};

let config = {
    entry: {
        app: [
            "@babel/polyfill", 
            "whatwg-fetch",
            "./src/App.tsx"
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "awesome-typescript-loader",
                        options: {
                            compilerOptions: {
                                noEmit: false
                            }
                        }
                    }
                ]
            }
        ]
    },
    devtool: "source-map",
    output: {
        path: path.resolve("./bin"),
        filename: "[name].js",
        chunkFilename: "[name].chunk.js",
        sourceMapFilename: "[file].map",
        publicPath: "/social_usage_tracking/static/"
    },
    devServer: {
        headers: { "Access-Control-Allow-Origin": "*" },
        publicPath: "http://localhost:8080/",
        https: false,
        overlay: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ["app", "vendor"],
            filename: "index.html",
            template: "./src/index.html",
            minify: { removeComments: true },
            hash: isWatchDevelopment,
            alwaysWriteToDisk: true
        })
    ]
}

if (isDevelopment) {
    config.module.rules.push({ test: /\.(jpg|png|woff|woff2|eot|ttf|svg|gif)(\?.+)?(#.+)?$/, use: ["url-loader?limit=100000"] });

    config.module.rules.push({ test: /\.less$/, use: ["style-loader", "css-loader", {loader: "postcss-loader", options: postCssOptions}, "less-loader"] });
    config.module.rules.push({ test: /\.css$/, use: ["style-loader", "css-loader", {loader: "postcss-loader", options: postCssOptions}] });

    config.plugins.push(new webpack.NamedModulesPlugin());

    config.plugins.push(new webpack.DefinePlugin({
        "process.env": {
            "NODE_ENV": JSON.stringify("development")
        }
    }));
}

if (isProduction) {
    config.output.filename = "[name].[chunkhash].js";
    config.output.chunkFilename = "[name].chunk.[chunkhash].js";

    config.module.rules.push({ test: /\.(jpg|png|woff|woff2|eot|ttf|svg|gif)(\?.+)?(#.+)?$/, use: ["url-loader?limit=1000"] });

    config.module.rules.push({ test: /\.less$/, use: [MiniCssExtractPlugin.loader, "css-loader", {loader: "postcss-loader", options: postCssOptions}, "less-loader"] });
    config.module.rules.push({ test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader", {loader: "postcss-loader", options: postCssOptions}] });

    config.plugins.push(new MiniCssExtractPlugin({filename: "[name].[contenthash].css", allChunks: true}));
    config.plugins.push(new webpack.DefinePlugin({
        "process.env": {
            "NODE_ENV": JSON.stringify("production")
        }
    }));
}

module.exports = config;