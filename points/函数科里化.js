// 函数柯理化

// 面试题

// add(1)(2)(3)(4) == 10

// 函数柯里化（Curring）: 是把接受多个参数的函数变为接受单一参数的函数，并且返回接受余下的参数且返回结果的新函数的技术
// 函数柯里化有两种不同的场景，一种为函数参数个数定长的函数，另外一种为函数参数个数不定长的函数

// 1.函数参数个数定长的柯里化解决方案

// 定长参数
function add(a,b,c,d) {
    return [
        ...arguments
    ].reduce((a,b)=>a+b)
}
function currying(fn) {
    let len = fn.length   // ?
    let args = []
    return function _c(...newArg) {
        // 合并参数
        args = [
            ...args,
            ...newArg
        ]
        // 判断当前参数集合args长度是否 《 目标函数fn的需求参数长度
        if(args.length < len){
            // 继续返回函数
            return _c
        }else {
            // 返回执行结果
            return fn.apply(this,args.slice(0,len))
        }
    }
}

let addCurry = currying(add)
let total = addCurry(1)(2)(3)(4)   // 同时支持addCurry(1)(2,3)(4)该方式调用

// 2 函数参数个数不定长的柯里化解决方案

function add(...args) {
    return args.reduce((a,b) => a+b)
}

function currying(fn) {
    let args = []
    return function _c(...newArgs){
        if(newArgs.length){
            args = [
                ...args,
                ...newArgs
            ]
            return _c
        } else {
            return fn.apply(this,args)
        }
    }
}

let addCurry = currying(add)
// 注意调用方式的变化
addCurry(1)(2)(3)(4,5)()