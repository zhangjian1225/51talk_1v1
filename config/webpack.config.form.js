var webpack = require('webpack');
var argv = require('yargs').argv;

var startTask = {
	init: function () {
		console.log('=============start form build===============');
		console.log('../../src/' + argv.project + '/form/js/form');

		if ( !argv.project ) {
			throw new Error('please input a project name');
			return;
		}
	}
};

startTask.init();

module.exports = {

	entry: {
		['../../src/' + argv.project + '/form/js/form']: '../form-vue/index.js'
	},

	output: {
		path: __dirname + '/build/',
		filename: '[name].js'
	},

	module: {
		loaders: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url'
			},
			{
				test: /\.s(a|c)ss$/,
				loader: 'style-loader!css-loader!sass-loader'
			}
		]
	},

	devServer: {
		contentBase: './build',
		colors: true,
		historyApiFallback: true,
		inline: true,
		hot: true
	},

	devTool: 'eval-source-map'

}