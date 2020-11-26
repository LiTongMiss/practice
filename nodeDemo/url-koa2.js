
const Koa = require('koa')
// 注意 reruire('koa-router)返回的是函数
const router = require('koa-router')()

const bodyparser = require('koa-bodyparser')
const app = new Koa()
app.use(bodyparser())


// 先导入fs模块,然后用readdirSync列出文件
// 这里可以用sync是因为启动时只运行一次，不存在性能问题
let files = fs.readdirSync(__dirname + '/controller')

// 过滤出js文件
let js_files = files.filter(f => {
    return f.endWith('.js')
})

// 处理每个js文件

for(var f of js_files) {
    // 引入js文件
    let mapping = require(__dirname + '/controller/'+ f)
    for(var url of mapping) {
        if(url.startWith('GET ')) {
            var path = url.substring(4)
            router.get(path, mapping[url])
        } else if(url.startWith('POST ')) {
            var path = url.substring(5)
            router.post(path, mapping[url])
        } else {
            // 无效的url
        }
    }
}

// app.use(async (ctx, next) => {
//     console.log(`Promise ${ctx.request.method}${ctx.request.url}`)
//     await next()
// })



// add route middleware
app.use(router.routes())


app.listen(3000)