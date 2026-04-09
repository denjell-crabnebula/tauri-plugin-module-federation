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
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods':
				'GET, POST, PUT, DELETE, PATCH, OPTIONS',
			'Access-Control-Allow-Headers':
				'X-Requested-With, content-type, Authorization',
		},
		hot: true,
		port: 3001,
	},
	target: 'web',
	output: {
		publicPath: 'auto',
		uniqueName: 'example_host',
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
			name: 'example_host',
			filename: 'remoteEntry.js',
			remotes: {
				example_guest:
					'example_guest@http://localhost:3002/remoteEntry.js',
			},
			runtimePlugins: [
				require.resolve('@crabnebula-dev/tauri-module-federation'),
			],
			shared: {
				react: {},
				'react-dom': {},
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
