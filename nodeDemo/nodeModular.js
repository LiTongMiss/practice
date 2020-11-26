//  commonJS 实现

// js是一种函数式编程语言，支持闭包。 node加载模块，用自执行函数包裹起来

(function() {
 // 模块代码  这样变量就是局部作用域的变量  不会造成全局污染
})()

// ----------------------module.exports 的实现--------------------

// 先准备一个对象module

let module = {
    id: 'demo',   // 文件名
    exports: {}
}

let load = function(module) {
    // 读取demo.js文件代码
    function greet(name) {
        console.log(`hello: ${name}`)
    }
    module.exports = greet
    // demo.js代码结束
    return module.exports
}

let exported = load(module)
// 保存module
save(module, exported)

// 变量module是node加载js文件前准备的一个变量，并将其传入加载函数，在demo.js中可以直接使用变量module的原因就在于他实际上是函数的一个参数

module.exports = greet

// 通过把参数module传递给load()函数，demo.js就顺利的把一个变量传递给了node执行环境，node会把module变量保存到某个地方
// 由于node保存了所有导入的module，当用require()获取module时，node找到对应的module，把这个module的exports变量返回，这样，另一个模块就顺利的那到了模块的输出

let greet = require('./demo')

// -----------------moudle.exports VS exports--------------------

//  node模块的加载机制

// 首先，node会把整个待加载的demo.js文件放入一个包装函数load中执行。在执行这个load()函数前，node准备好了module变量
let module = {
    id: 'demo',   // 文件名
    exports: {}
}
// load()函数最终返回module.exports
let load = function (exports, module) {
    // demo.js的文件内容
    // ...
    // load函数返回:
    return module.exports;
};

var exported = load(module.exports, module);

// 默认情况下，node准备的exports变量和module.expports变量实际上是同一个变量，并且初始化为空对象{}
// 如果要输出的是一个函数或者数组，那么只能给module.expports赋值，给exports赋值是无效的，因为赋值后，module.expports仍是空对象{}

// 输出的写法
exports.foo = function () { return 'foo'; };
exports.bar = function () { return 'bar'; };
module.exports.foo = function () { return 'foo'; };
module.exports.bar = function () { return 'bar'; };
