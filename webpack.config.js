const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: {
		bundle: './src/index.ts',
	},
	output: {
		filename: '[name].js',
	},
	plugins: [
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
		new HtmlWebpackPlugin({
			title: 'template',
			template: './src/index.html',
		}),
		new CopyPlugin({
			patterns: [{ from: './assets/**/*', to: './' }],
		}),
	],
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 8080,
	},
	resolve: {
		extensions: ['.ts', '.js'],
		fallback: {
			path: require.resolve('path-browserify'),
		},
	},
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: 'ts-loader' },
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};
