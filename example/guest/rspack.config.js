const { HtmlRspackPlugin } = require('@rspack/core');
const {
	ModuleFederationPlugin,
} = require('@module-federation/enhanced/rspack');
const { ReactRefreshRspackPlugin } = require('@rspack/plugin-react-refresh');
const path = require('node:path');
const { withZephyr } = require('zephyr-rspack-plugin');

const isDev = process.env.NODE_ENV !== 'production';


let config = {
	entry: './src/index',
	mode: 'development',
	devServer: {
		static: path.join(__dirname, 'dist'),
		port: 3002,
		hot: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods':
				'GET, POST, PUT, DELETE, PATCH, OPTIONS',
			'Access-Control-Allow-Headers':
				'X-Requested-With, content-type, Authorization',
		},
	},
	target: 'web',
	output: {
		publicPath: 'auto',
		uniqueName: 'example_guest',
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'builtin:swc-loader',
					options: {
						jsc: {
							parser: {
								syntax: 'ecmascript',
								jsx: true,
							},
							transform: {
								react: {
									runtime: 'automatic',
									development: isDev,
									refresh: isDev,
								},
							},
						},
					},
				},
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'builtin:swc-loader',
					options: {
						jsc: {
							parser: {
								syntax: 'typescript',
								tsx: true,
							},
							transform: {
								react: {
									runtime: 'automatic',
									development: isDev,
									refresh: isDev,
								},
							},
						},
					},
				},
			},
		],
	},
	plugins: [
		new ModuleFederationPlugin({
			name: 'example_guest',
			filename: 'remoteEntry.js',
			exposes: {
				'./Button': './src/Button.js',
			},
			remotes: {
				example_guest_2:
					'example_guest_2@http://localhost:3003/remoteEntry.js',
			},
			shared: {
				react: {
					eager: true,
				},
				'react-dom': {
					eager: true,
				},
				lodash: {},
			},
		}),
		new HtmlRspackPlugin({
			template: './public/index.html',
		}),
		isDev && new ReactRefreshRspackPlugin(),
	].filter(Boolean),
};

if (process.env.WITH_ZEPHYR === 'true') config = withZephyr()(config);

module.exports = config;
