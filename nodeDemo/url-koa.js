const Koa = require('koa')
// 注意 reruire('koa-router)返回的是函数
const router = require('koa-router')()

const bodyparser = require('koa-bodyparser')
const app = new Koa()
app.use(bodyparser())
app.use(async (ctx, next) => {
    console.log(`Promise ${ctx.request.method}${ctx.request.url}`)
    await next()
})

// add url-route
router.get('/hello/:name', async (ctx, next) => {
    var name = ctx.params.name
    ctx.response.body = `<h1>hello ${name}</h1>`
})

router.get('/', async (ctx, next) => {
    var name = ctx.params.name
    ctx.response.body = `<h1>index</h1>
        <form action="/sigin" method="post">
            <p>name: <input name="name" value="koa"></p>
            <p>password: <input name="password" type="password" ></p>
            <p><input type="submit" value="submit" ></p>
        </form>`
})

router.post('/sigin', async(ctx, next) => {
    console.log('ctx.request', ctx.request)
    let name = ctx.request.body.name ||''
    let password = ctx.request.body.password || ''
    if(name === 'koa' && password === '123456'){
        ctx.response.body =  `<h1>hello ${name}</h1>`
    } else {
        ctx.response.body =  `<h1>login failed</h1>
        <p><a href="/">Try again</a></p>`
    }
})


// add route middleware
app.use(router.routes())


app.listen(3000)