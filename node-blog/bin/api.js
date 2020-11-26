
// node启动一个服务的模块
const http =reqiure('http')
const serverHandle = require('../app')

const POST = 8000

const server = http.createServer(serverHandle)

server.listen(POST)