const Koa = require('koa')

// 创建一个koa对象便是web app本身
const app = new Koa()


app.use(async (ctx, next) => {
    const start = new Date().getTime()
    await next()
    const ms = new Date().getTime - start
    console.log(`${ctx.request.method}${ctx.request.url}: ${ms}ms`)
    ctx.response.set('x-Response-Time', `${ms}ms`)
})
// 对于任何请求，app将调用异步处理请求
app.use(async (ctx, next) => {
    await next()
    ctx.response.type = 'text/html'
    ctx.response.body = '<div>hello world</div>'
})

app.listen(3000)
