const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin'); // js压缩使用，这个插件是不用安装的
const htmlPlugin = require('html-webpack-plugin'); // 处理html文件的，要安装的
const cleanWebpackPlugin = require('clean-webpack-plugin'); // 每次构建前清理 /dist 文件夹
const extractTextPlugin = require('extract-text-webpack-plugin'); // 分离CSS样式的插件
const purifyCSSPlugin = require('purifycss-webpack'); // 使用purifycss插件从你的CSS删除未使用到的选择器

var website = {
  publicPath: "http://192.168.0.106:8088/"
}

module.exports = {
  devtool: "source-map", // 四个选项: source-map、cheap-moudle-source-map、eval-source-map、cheap-moudle-eval-source-map
  entry: {
    main: "./src/main.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-[hash:8].js",
    publicPath: website.publicPath
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
            loader: "css-loader",
            options: {importLoaders: 1}
          },{
            loader: "postcss-loader"
          }]
        })
      },{
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
      },{
        test: /\.(htm|html)$/i,
        use: ['html-withimg-loader']
      },{
        test: /\.less$/,
        use: extractTextPlugin.extract({
          use: [{
            loader: "css-loader"
          },{
            loader: "postcss-loader"
          },{
            loader: "less-loader"
          }],
          fallback: "style-loader"
        })
      },{
        test: /\.scss$/,
        use: extractTextPlugin.extract({
          use: [{
            loader: "css-loader"
          },{
            loader: "postcss-loader"
          },{
            loader: "sass-loader"
          }],
          fallback: "style-loader"
        })
      },{
        test: /\.(jsx|js)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  plugins: [
    // new uglifyJsPlugin(), // 压缩打包的js
    new htmlPlugin({
      minify: {
        removeAttributeQuotes: true // 去掉标签属性的引号
      },
      hash: true, // 解决缓存问题，每次都给它链接?号后面一个不同的字符串
      template: './src/index.html'
    }),
    new extractTextPlugin("css/[name]-[hash:8].css"), // 打包到css目录下,dist根目录要是没有css目录就自动创建一个
    new purifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html')), // 去除.html文件中没有使用到的css样式
    }), // 去除没用到的css插件
    new cleanWebpackPlugin(['dist']), // 每次构建前清理 /dist 文件夹
  ],
  devServer: { // 配置服务与热更新
    contentBase: path.resolve(__dirname, 'dist'), // 监听哪个目录下启动热更新
    host: '192.168.0.106', // 服务地址 192.168.0.106本地
    compress: true, // 服务器端的压缩，开启
    port: '8088', // 端口号
  }
}
