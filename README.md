![Alt text](./static/webpack-pic.png "webpack3.6 config")
>以下只是个人在项目的一些配置，更详细的配置项请查看webpack官方文档

> 英文官方网址: https://webpack.js.org/  
> 中文网址: https://doc.webpack-china.org/configuration/  
> GitHub地址: https://github.com/webpack/webpack

## 本配置文件的依赖项说明

<p>1. 服务与热更新 [官方GitHub地址](https://github.com/webpack/webpack-dev-server)</p>
<pre>
<code>
npm install webpack webpack-dev-server –save-dev

devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:8088
    }


在package.json文件中配置一下 "server" 执行的脚本, 可在执行命令后自动打开浏览器:
"scripts": {
    "server": "webpack-dev-server --open",
    "build": "webpack --config webpack.config.js --progress --display-modules --colors --display-reasons"
  }


@@ webpack常用命令使用如下：
1、默认使用当前目录的webpack.config.js作为配置文件。如果要指定另外的配置文件，可以执行：webpack –config webpack.custom.config.js

2、webpack 的执行也很简单，直接执行  $  webpack --display-error-details
即可，后面的参数“–display-error-details”是推荐加上的，方便出错时能查阅更详尽的信息（比如 webpack 寻找模块的过程），从而更好定位到问题。 

3、常用命令 
webpack的使用和browserify有些类似，下面列举几个常用命令：
    1、webpack 最基本的启动webpack命令
    2、webpack -w 提供watch方法，实时进行打包更新
    3、webpack -p 对打包后的文件进行压缩
    4、webpack -d 提供SourceMaps，方便调试
    5、webpack --colors 输出结果带彩色，比如：会用红色显示耗时较长的步骤
    6、webpack --profile 输出性能数据，可以看到每一步的耗时
    7、webpack --display-modules 默认情况下 node_modules 下的模块会被隐藏，加上这个参数可以显示这些被隐藏的模块

前面的四个命令比较基础，使用频率会比较大，后面的命令主要是用来定位打包时间较长的原因，方便改进配置文件，提高打包效率。
</code>
</pre>

<p>2. 构建前清理 /dist 文件夹 [官方GitHub地址](https://github.com/johnagan/clean-webpack-plugin)</p>

<pre>
<code>
npm install clean-webpack-plugin --save-dev

// 在webpack.config.js中进行配置一下
const CleanWebpackPlugin = require('clean-webpack-plugin');

// plugins插件选项要使用它
plugins: [
    new CleanWebpackPlugin(['dist'])
    ]
</code>
</pre>

<p>3. css文件打包</p>
>npm中的网址：https://www.npmjs.com/package/style-loader、https://www.npmjs.com/package/css-loader

<pre>
<code>
npm install style-loader css-loader --save-dev
module:{
        rules: [
            {
              test: /\.css$/,
              use: [ 'style-loader', 'css-loader' ]
            }
          ]
    },
</code>
</pre>

<p>4. 配置JS压缩</p>

<pre>
<code>
- webpack中自带了这个插件，直接配置即可

// 在webpack.config.js中引入这个uglifyjs-webpack-plugin插件
const uglify = require('uglifyjs-webpack-plugin');

// plugins插件选项要使用它
 plugins:[
        new uglify()
    ]
</code>
</pre>

<p>5. 打包HTML文件</p>
>GitHub中的网址：https://github.com/jantimon/html-webpack-plugin

<pre>
<code>
// 在webpack.config.js中引入这个html-webpack-plugin插件
const htmlPlugin= require('html-webpack-plugin');

// plugins插件选项要使用它
 plugins:[
        new htmlPlugin({
            minify:{
                // 去掉html中属性的单双引号
                removeAttributeQuotes:true
            },
            // 设置为true避免缓存， 在HTML中引入的外联文件地址后面会加上随机的一段hash生成的字符串
            hash:true,
            // 打包的来源文件
            template:'./src/index.html'
           
        })
    ]
</code>
</pre>

<p>6. 图片与文件打包</p>
>file-loader(解决引入路径的问题)、url-loader(可将图片base64编码)

<pre>
<code>
npm install file-loader url-loader –save-dev

module:{
    rules: [
        {
            test: /\.(png|jpe?g|gif|svg)$/,
            use: [{
                // 如今的url-loader自带了file-loader的功能，以后不需要再单独配置file-loader了
                loader: "url-loader",
                options: {
                    // 图片大于1000字节bytes，就转换为base64编码
                    limit: 1000,
                    // 把打包的图片放到这个目录下
                    outputPath: "images/"
                }
            }]
        }
    ]
}
</code>
</pre>

<p>7. CSS分离:extract-text-webpack-plugin</p>
>GitHub官方地址 https://github.com/webpack-contrib/extract-text-webpack-plugin

<pre>
<code>
npm install extract-text-webpack-plugin --save-dev

// 在webpack.config.js中引入这个extract-text-webpack-plugin插件
const extractTextPlugin = require("extract-text-webpack-plugin");

module:{
        rules: [
            {
              test: /\.css$/,
              use: extractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
              })
            }
          ]
    }

css打包后图片的路径问题解决：
var website = {
  publicPath: "http://192.168.0.106:8088/"
}
//出口文件的配置项
    output:{
        //输出的路径，用了Node语法
        path: path.resolve(__dirname,'dist'),
        //输出的文件名称
        filename: '[name]-[hash:8].js',
        publicPath: website.publicPath
    },
</code>
</pre>

<p>8. html文件中通过img:src引入的图片，打包后的路径错误处理方法</p>
>GitHub官方地址 https://github.com/wzsxyz/html-withimg-loader

<pre>
<code>
npm install html-withimg-loader --save-dev

// 直接配置即可使用，打包后的路径就是正确的了
module:{
        rules: [
            {
                test: /\.(htm|html)$/i,
                use:[ 'html-withimg-loader'] 
            }
          ]
    }
</code>
</pre>

<p>9. less-loader的讲解</p>

<pre>
<code>
*先安装Less的服务，才能进行less-loader打包服务
npm install less --save-dev
npm install less-loader --save-dev

{
    test: /\.less$/,
    use: extractTextPlugin.extract({
        use: [{
            loader: "css-loader"
        }, {
            loader: "less-loader"
        }],
        fallback: "style-loader"
    })
 }
</code>
</pre>

<p>10. sass文件打包与分离</p>

<pre>
<code>
*node-sass：因为sass-loader依赖于node-sass，所以需要先安装node-sass
npm install --save-dev node-sass
npm install --save-dev sass-loader

{
    test: /\.scss$/,
    use: extractTextPlugin.extract({
        use: [{
            loader: "css-loader"
        }, {
            loader: "sass-loader"
        }],
        // use style-loader in development
        fallback: "style-loader"
    })
 }
</code>
</pre>

<p>11. postcss-loader自动添加css3前缀</p>
>GitHub官方地址 https://github.com/postcss/postcss-loader  
>GitHub官方地址 https://github.com/postcss/autoprefixer（可根据浏览器的版本就行配置添加前缀）

<pre>
<code>
*需要安装两个包postcss-loader 和autoprefixer（自动添加前缀的插件）
npm install postcss-loader autoprefixer --save-dev

// 建立一个postcss.config.js文件, 配置以下内容
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}

// 对postcss.config.js配置完成后，还需编写我们的loader配置
{
    test: /\.css$/,
    use: [
        {
            loader: "style-loader"
        }, {
            loader: "css-loader",
            options: {
                modules: true
            }
        }, {
            loader: "postcss-loader"
        }
    ]
}

// 配置提取CSS的loader配置
{
    test: /\.css$/,
    use: extractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
        ]
    })
    
}
</code>
</pre>

<p>12. 运用PurifyCSS插件剔除没有使用到的css样式</p>
>GitHub官方地址 https://github.com/webpack-contrib/purifycss-webpack

<pre>
<code>
* PurifyCSS-webpack 要依赖于 purify-css 这个包，所以这两个都需要安装
npm i -D purifycss-webpack purify-css

1.引入glob:
因为我们需要同步检查html模板，所以我们需要引入node的glob对象使用。在webpack.config.js文件头部引入glob
const glob = require('glob');

2.同样在webpack.config.js文件头部引入purifycss-webpack
const PurifyCSSPlugin = require("purifycss-webpack");

3.配置plugins
这里配置了一个paths，主要是需找html模板，purifycss根据这个配置会遍历你的文件，查找哪些css被使用了
plugins:[
    new PurifyCSSPlugin({
        // Give paths to parse for rules. These should be absolute!
        paths: glob.sync(path.join(__dirname, 'src/*.html')),
        })
]
</code>
</pre>


<p>13. Babel编译ES6、7、8的安装与配置</p>
>GitHub官方地址 https://github.com/babel/babel-loader

<pre>
<code>
* 现在babel官方推荐babel-preset-env 取代了之前的 babel-preset-es2015，babel-preset-env可以编译ES6、7、8
npm install --save-dev babel-loader babel-core babel-preset-env (忽略这个babel-preset-es2015) babel-preset-react

{
    test: /\.(jsx|js)$/,
    use:{
        loader: 'babel-loader',
        options: {
            presets: [
                "es2015","react"
            ]
        }
    },
    exclude:/node_modules/
}


或 单独提出来配置

在项目根目录新建.babelrc文件，并把配置写到文件里
{
    "presets": ["react","env"]
}

webpack.config.js里的loader配置
{
    test: /\.(jsx|js)$/,
    use: {
        loader:'babel-loader',
    },
    exclude: /(node_modules|bower_components)/
}

</code>
</pre>

<p>14. 关于打包后的代码调试问题</p>

<pre>
<code>
在使用webpack时只要通过简单的devtool配置，webapck就会自动给我们生产source maps 文件，map文件是一种对应编译文件和源文件的方法，让我们调试起来更简单。

在配置devtool时，webpack给我们提供了四种选项：
    1、source-map: 在一个单独文件中产生一个完整且功能完全的文件。这个文件具有最好的source map,但是它会减慢打包速度。
    2、cheap-module-source-map: 在一个单独的文件中产生一个不带列映射的map，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号）,会对调试造成不便。
    3、eval-source-map: 使用eval打包源文件模块，在同一个文件中生产干净的完整版的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定要不开启这个选项。
    4、cheap-module-eval-source-map: 这是在打包文件时最快的生产source map的方法，生产的 Source map 会和打包后的JavaScript文件同行显示，没有影射列，和eval-source-map选项具有相似的缺点。

四种打包模式，有上到下打包速度越来越快，不过同时也具有越来越多的负面作用，较快的打包速度的后果就是对执行和调试有一定的影响。

建议，如果大型项目可以使用source-map，如果是中小型项目使用eval-source-map就完全可以应对，需要强调说明的是，source map只适用于开发阶段，上线前记得修改这些调试设置。


// 简单的配置
module.exports = {
  devtool: 'eval-source-map', // 加上这句配置信息就行了
  entry:  __dirname + "/app/main.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  }
}
 
总结：调试在开发中也是必不可少的，但是一定要记得在上线前一定要修改webpack配置，在打出上线包。
</code>
</pre>