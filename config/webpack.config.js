var path = require("path");
var webpack = require("webpack");
var argv = require('yargs').argv;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var cliParam = {

    getProjectName: function() {
        console.log("=================webpack.config.js===================");
        var projectNames = argv.project;
        if (!projectNames) {
            throw new Error('please input a project name');
        }
        this.project = projectNames;
    },

    init: function() {
        this.getProjectName();
    }
};
cliParam.init();
module.exports = {
    entry: ["./src/" + cliParam.project + "/js/index.js"],
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "index.js",
      publicPath: "/dist/"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: "babel-loader",
            exclude: /node_modules/
        }, {
          test: /\.ejs$/,
          loader: 'ejs-compiled-loader'
        }]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: "../index.html",
            template: "./src/" + cliParam.project + "/index.ejs",
            inject:false
        }),
        new HtmlWebpackPlugin({
            filename: "../form.html",
            template: "./src/" + cliParam.project + "/form.ejs",
            inject:false
        })
    ],
    watch:false,
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    },

    devtool: "eval-source-map"
}
