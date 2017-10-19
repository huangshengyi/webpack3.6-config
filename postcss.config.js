module.exports = {
	plugins: [
    require('autoprefixer')({browsers: ['last 10 versions']}),
    // require('cssnano')({
    //     preset: 'default',
    // }),
	]
}

// https://github.com/ai/browserslist#queries 关于浏览器的版本写法
// {browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8']}
