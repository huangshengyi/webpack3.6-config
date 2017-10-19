// 配置webpack的loader规则rules
const extractTextPlugin = require('extract-text-webpack-plugin'); // 分离CSS样式的插件

const moduleRules = {
	rules: [{
		test: /\.css$/,
		use: extractTextPlugin.extract({
			fallback: "style-loader",
			use: [{
				loader: "css-loader",
				options: {
					importLoaders: 1
				}
			}, {
				loader: "postcss-loader"
			}]
		})
	}, {
		test: /\.(png|jpe?g|gif|svg)$/,
		use: [{
			// url-loader自带了file-loader的功能，以后不需要再单独配置file-loader了
			loader: "url-loader",
			options: {
				// 图片大于1000字节bytes，就转换为base64编码
				limit: 1000,
				outputPath: "images/" // 把打包的图片放到这个目录下
			}
		}]
	}, {
		test: /\.(htm|html)$/i,
		use: ['html-withimg-loader']
	}, {
		test: /\.less$/,
		use: extractTextPlugin.extract({
			use: [{
				loader: "css-loader"
			}, {
				loader: "postcss-loader"
			}, {
				loader: "less-loader"
			}],
			fallback: "style-loader"
		})
	}, {
		test: /\.scss$/,
		use: extractTextPlugin.extract({
			use: [{
				loader: "css-loader"
			}, {
				loader: "postcss-loader"
			}, {
				loader: "sass-loader"
			}],
			fallback: "style-loader"
		})
	}, {
		test: /\.(jsx|js)$/,
		use: {
			loader: "babel-loader"
		},
		exclude: /(node_modules|bower_components)/
	}]
};

module.exports = moduleRules
