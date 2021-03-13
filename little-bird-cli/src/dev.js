import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const config = require('./webpack.config');

let dev = (port)=>{
    // 启动项目后自动打开浏览器
    config.plugins.push(new OpenBrowserPlugin({url:`http://localhost:${port}`}))
    new webpackDevServer(webpack(config), {
        contentBase: './public',
        hot:true,
        historyApiFallback:true
    }).listen(port, 'localhost', function(err,result){
        if(err){
            console.log(err)
        }
    })
}

module.exports = dev;