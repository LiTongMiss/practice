// js基础
// 1、如何早ES5环境下实现let

// 查看babel转换前后的结果
// 源代码
for(let i = 0; i<10;i++) {
    console.log(i)
}
console.log(i)

// babel转换后
for(var _i=0;_i<10;_i++){
    console.log(_i)
}
console.log(_i)

// babel在let定义的变量前加了道下划线，避免在会计作用域外访问到该变量，除了对变量名的转换，我们也可以通过自执行函数来模拟块级作用域
(function(){
    for(var i = 0;i<5; i++){
        console.log(l)
    }
})()
console.log(i)      // Uncaught ReferenceError: i is not defined

// 2.如何在es5环境下实现const
// 实现const的关键在于Object.defineProperty()
// 对于const不可修改的特性，我们通过设置writable属性实现
function _const(key, value) {
    const desc = {
        value,
        writable: false
    }
    Object.definePropertie(windoe, key, desc)
}

_const('obj', {a:1})   // 定义obj
Object.b = 2   // 可以正常给obj的属性赋值
obj = {}    // 抛出错误，提示对象read-only

// 3.手写call()
// call方法的使用一个指定的this值和单独给出的一个或多个参数来调用一个函数
// 语法： function.call(thisArg, arg1,arg2, ...)

Function.prototype.myCall = function(thisArg, ...args){
    if(typeof this !== 'function'){
        throw new TypeError('error')
    }
    const fn = Symbol('fn')     // 声明一个独有的Synmbol属性，防止fn被覆盖
    thisArg = thisArg || window   // 若没有传入this，默认绑定window对象
    thisArg[fn] = this      // this指向调用call的对象，即我们要改变this指向的函数
    const result = thisArg[fn](...arg)   // 执行当前函数
    delete thisArg[fn]  // 删除我们声明的fn属性
    return result     // 返回函数执行结果
}

// 4.手写apply
// apply() 方法调用一个具有给定this值的函数，以及作为一个数组（或类似数组对象）提供的参数。
// 语法：func.apply(thisArg, [argsArray])
// apply()和call()类似，区别在于call()接收参数列表，而apply()接收一个参数数组，所以我们在call()的实现上简单改一下入参形式即可
Function.prototype.myApply = function(thisArg, args) {
    if(typeof this !== 'function') {
        throw new TypeError('error')
    }
    const fn = Symbol('fn')        // 声明一个独有的Symbol属性, 防止fn覆盖已有属性
    thisArg = thisArg || window    // 若没有传入this, 默认绑定window对象
    thisArg[fn] = this              // this指向调用call的对象,即我们要改变this指向的函数
    const result = thisArg[fn](...args)  // 执行当前函数
    delete thisArg[fn]              // 删除我们声明的fn属性
    return result                  // 返回函数执行结果
}

// 5.手写bind（）
// bind方法创建一个新的函数，在binde被调用时，这个新函数的this被指定为bind的第一个参数，而其余参数将作为新函数的参数，供调用时使用
// 语法：function.bind(thisArg, arg1,arg2, ...)

// 从用法上看，似乎给call/apply包一层function就实现了binde
Function.prototypr.myBinde = function(thisArg, ...args){
    return ()=> {
        this.apply(this.arg, args)
    }
}

// 但是，忽略了三点
// 1.bind除了this还接收其他参数，binde返回的函数也接收参数，这两部分的参数都要传给返回的函数
// 2.new的优先级：如果bind绑定后的函数被new了，那么此时this指向就发生改变，此时的this就是当前函数实例
// 3.没有保留原函数在原型链上的属性和方法

Function.prototype.bind = function(thisArg, ...args){
    if(typeof thisArg !== 'function') {
        throw TypeError('')
    }
    var self = this
    //new 优先级
    var fbound = function() {
        self.apply(this instanceof self ? this : thisArg, args.concat(Array.prototype.slice.call(arguments)))
    }
    // 集成原型上的属性和方法
    fbound.prototype = Object.create(self.prototype)
    return fbound
}
// 6.手写一个防抖函数
// 防抖，即短时间内大量触发同一事件，只会执行一次函数，实现原理为设置一个定时器，约定在xx毫秒后再触发事件处理，
//每次触发事件都会重新设置计时器，直到xx毫秒内无第二次操作，防抖常用于搜索框/滚动条的监听事件处理，
// 如果不做防抖，每输入一个字/滚动屏幕，都会触发事件处理，造成性能浪费。

function debounde(func, wait){
    let timeout = null
    return function () {
        let context = this
        let args = arguments
        if(timeout) {
            clearTimeout()
        }
        timeout = setTimeout(()=> {
            func.apply(context, args)
        },wait)
    }
}

// 7.手写一个节流函数

//防抖是延迟执行，而节流是间隔执行，函数节流即每隔一段时间就执行一次，实现原理为设置一个定时器，约定xx毫秒后执行事件，
//如果时间到了，那么执行函数并重置定时器，和防抖的区别在于，防抖每次触发事件都重置定时器，而节流在定时器到时间后再清空定时器

function throttle(funv,wait){
    let timrout = null
    return function() {
        let context = this
        let args = arguments
        if(!timrout){
            timrout = setTimeout(() => {
                timrout = null
                func.apply(context, args)

            }, wait)
        }
    }
}

// 实现方式2：使用两个时间戳prev旧时间戳和now新时间戳，每次触发事件都判断二者的时间差，如果到达规定时间，执行函数并重置旧时间戳

function throttle(func, wait) {
    var prev = 0
    return function() {
        let now = Date.now()
        let context = this
        let args = arguments
        if(now-prev>wait){
            func.apply(context, args)
            prev = now
        }
    }
}

// 8.数组片平滑
// 1.es6的flat()

const arr = [1,[1,2], [1,2,3]]
arr.flat(Infinity)   // 参数是扁平化的层

// 2.序列化后正则
const arr = [1,[1,2], [1,2,3]]
const str = `[${JSON.stringify(arr).replace(/()\[|\])/g, '')}]`
JSON.parse(str)

// 3.递归
// 对于树状结构的数据，最直接的处理方式就是递归
const arr = [1,[1,2], [1,2,3]]
function flat(arr) {
    let result = []
    for(const item of arr) {
        item instanceof Array ? result = result.concat(flat(item)): result.push(item)
    }
    return result
}

// 4.reduce递归
const arr = [1,[1,2], [1,2,3]]
function flat(arr){
    return arr.reduce((prev, cur)=> {
        return prev.concat(cur instanceof Array ? flat(cur) : cur)
    }, [])
}

// 5.迭代+展开运算符
const arr = [1,[1,2], [1,2,3]]

while(arr.some(Array.isArray)){
    arr = [].conzat(...arr)
}

// 9.手写一个promise

// js面向对象
// 1.shixian new

// new是关键字  用函数来模拟
function myNew(foo, ...args) {
    // 创建新对象，并集成构造方法的prototype属性，这一步是为看把obj挂圆形脸上，相当于obj.__proto__= Foo.prototype
    let obj = Object.create(foo.prototypr)
    // 执行构造方法，并为其绑定新this，这一步是为了让构造方法能进行this。name = name之类的操作，args是构造方法的入参，因为这里用myNew模拟，所以入参从myNew传入
    let result = foo.apply(obj,args)
    // 如果构造方法已经return了一个对象，那么久返回该对象，一般情况下，构造方法不会返回新实例,胆使用者可以选择返回新实例来覆盖new创建的对象，否则返回myNew创建的新对象
    return typeof result ==='object' && reslut !== null ? result : obj
}

// 2.es5如何实现集成
// 1.原型链集成

// 父类
function Parent(){
    this.name = 'sss'
}

// 父类的原型方法
Parent.prototype.getName = function() {
    return this.name
}

// 子类
function Child (){

}

// 让子类的原型对象指向父类实例，这样一来在Child实例中找不到的属性和方法就会到原型对象（父类实例）上寻找
Child.prototype = new Parent()
// 根据原型链的规则，顺便帮顶一下constructor，这一步不影响集成，只是在用到constructor时会需要
Child.prototype.constructor = Child  

// 然后Child实例就能访问到父类及原型上的name属性和getName()方法
const child = new Child()

// 原型继承的缺点:

// 由于所有Child实例原型都指向同一个Parent实例, 因此对某个Child实例的父类引用类型变量修改会影响所有的Child实例
// 在创建子类实例时无法向父类构造传参, 即没有实现super()的功能


// 2.构造函数聚成
function Parent(name) {
    this.name = name
}
Parent.prototypr.getName = function() {
    return this.name
}

function Child() {
    Parent.call(this, 'zhangsan')
}

// 构造函数继承的缺点:
// 继承不到父类原型上的属性和方法

// 3.组合式继承
// 既然原型链继承和构造函数继承各有互补的优缺点, 那么我们为什么不组合起来使用呢, 所以就有了综合二者的组合式继承

function Parent(name) {
    this.name = [name]
}
Parent.prototype.getName = function() {
    return this.name
}
function Child() {
    // 构造函数继承
    Parent.call(this, 'zhangsan') 
}
//原型链继承
Child.prototype = new Parent()
Child.prototype.constructor = Child

// 组合式继承的缺点:
// 每次创建子类实例都执行了两次构造函数(Parent.call()和new Parent())，虽然这并不影响对父类的继承，但子类创建实例时，原型中会存在两份相同的属性和方法，这并不优雅

// 四. 寄生式组合继承
// 为了解决构造函数被执行两次的问题, 我们将指向父类实例改为指向父类原型, 减去一次构造函数的执行

function Parent(name) {
    this.name = [name]
}
Parent.prototype.getName = function() {
    return this.name
}
function Child() {
    // 构造函数继承
    Parent.call(this, 'zhangsan') 
}
//原型链继承
// Child.prototype = new Parent()
Child.prototype = Object.create(Parent.prototype)  //将`指向父类实例`改为`指向父类原型`
Child.prototype.constructor = Child

