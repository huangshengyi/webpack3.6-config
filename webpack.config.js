const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin'); // js压缩使用，这个插件是不用安装的
const htmlPlugin = require('html-webpack-plugin'); // 处理html文件的，要安装的
const cleanWebpackPlugin = require('clean-webpack-plugin'); // 每次构建前清理 /dist 文件夹
const extractTextPlugin = require('extract-text-webpack-plugin'); // 分离CSS样式的插件
const purifyCSSPlugin = require('purifycss-webpack'); // 使用purifycss插件从你的CSS删除未使用到的选择器
// const entry = require('./webpackConfig/entry.js'); // 引入入口文件
const moduleRulesLoader = require('./webpackConfig/moduleRulesLoader.js'); // loader规则的配置
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩CSS
const copyWebpackPlugin = require('copy-webpack-plugin'); // 集中拷贝静态资源

// console.log(encodeURIComponent(process.env.type));
// 这里的type是npm执行script的build通过set关键字传过来的
if (process.env.type === "build") {
  // 生产环境的
  var website = {
    publicPath: "http://www.qqyiyi.cn/"
    // publicPath: "http://192.168.0.106/aaa/webpack3/dist/" // 打包后的测试地址
  }
} else {
  // 开发环境的
  var website = {
    publicPath: "http://192.168.0.106:8088/" // 热更新测试
    // publicPath: "http://192.168.0.106/aaa/webpack3/dist/" // 打包后的测试地址
  }
}

module.exports = {
  devtool: "source-map", // 四个选项: source-map、cheap-moudle-source-map、eval-source-map、cheap-moudle-eval-source-map
  entry: {
    main: "./src/main.js",
    jquery: "jquery"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-[hash:8].js",
    publicPath: website.publicPath
  },
  module: moduleRulesLoader,
  plugins: [
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['jquery'], // 把entry入口文件的jquery文件单独抽离
      filename: "assets/js/[name].js", // 抽离到那个位置
      minChunks: 2 // 最小抽离出两个文件
    }),
    new uglifyJsPlugin({
      exclude: /(node_modules|bower_components)/,
      include: /\/(node_modules|bower_components)\/jquery/
    }), // 压缩打包的js
    new webpack.ProvidePlugin({
      jQuery: "jquery", // 也可以使用webpack自带的ProvidePlugin插件来引入第三方库jquery
    }),
    new htmlPlugin({
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeAttributeQuotes: true // 去掉标签属性的引号
      },
      hash: true, // 解决缓存问题，每次都给它链接?号后面一个不同的字符串
      template: './src/index.html'
    }),
    new extractTextPlugin("css/[name]-[hash:8].css"), // 打包到css目录下,dist根目录要是没有css目录就自动创建一个
    new purifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html')), // 去除.html文件中没有使用到的css样式
    }), // 去除没用到的css插件
    new webpack.BannerPlugin('qqyiyi版权所有'), // 在每次打包都带上这个版权的信息
    new copyWebpackPlugin([
      {
        from: __dirname + '/src/public', // 需要拷贝的资源来自哪个文件夹
        to: './public' // “./”是指上面output导出的dist文件夹的根目录里的public文件夹下
      }
    ]), // 拷贝项目的静态资源文件
    new webpack.HotModuleReplacementPlugin(), // 热更新，如果不能热更新就加上这个插件
    new cleanWebpackPlugin(['dist']), // 每次构建前清理 /dist 文件夹
  ],
  devServer: { // 配置服务与热更新
    contentBase: path.resolve(__dirname, 'dist'), // 监听哪个目录下启动热更新
    host: '192.168.0.106', // 服务地址 192.168.0.106本地
    compress: true, // 服务器端的压缩，开启
    port: '8088', // 端口号
  },
  watchOptions: { // 实时打包更新
    poll: 1000, // 每1s时间就检测文件是否修改，修改了就自动帮我们打包
    aggregeateTimeout: 500, // 设置的是我们连续按Ctrl+S保存时，500毫秒内只执行打包一次
    ignored: /node_modules/, // 这个文件夹不监视
  }
}
