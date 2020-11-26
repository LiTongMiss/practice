
// 如何让(a===1&&a===2&&a===3)为true



// 使用toString或者valueOf实现
// 当获取对象的字符串表示的时候，先调用valueOf方法 ，如果valueOf方法返回的数据不是基本数据类型，再调用toString方法   默认valueOf方法会返回对象本身 toString会返回 [object Object]
// 解题方法

class A{
    constructor(value) {
        this.value = value
    }
    // 以下两个方法写一个就可以， 只写toString方法  没有valueOf方法
    valueOf(){
        return this.value++
    }
    toString() {
        return this.value++
    }
}
const a = new A(1)
console.log((a===1&&a===2&&a===3))

// 相似面试题
// f(1)=1
// f(1)(2)=3
// f(1)(2)(3)=6

function f() {
    let args = [...arguments]
    let add = function() {
        args.push(...arguments)
        return add
    }
    add.toString = function() {
        return args.reduce((a,b)=>{
            return a+b
        })
    }
    return add
}

// 在使用对象的时候，如果对象是一个数组的话，那么上面的逻辑还是会成立，但此时的toString()会变成隐式调用join()方法，
//换句话说，对象中如果是数组，当你不重写其它的toString()方法，其默认实现就是调用数组的join()方法返回值作为toString()的返回值，
//所以这题又多了一个新的解法，就是在不复写toString()的前提下，复写join()方法，把它变成shift()方法，它能让数组的第一个元素从其中删除，并返回第一个元素的值。

class A extends Array {
    join = this.shift;
  }
  const a = new A(1, 2, 3);
  if (a == 1 && a == 2 && a == 3) {
    console.log("Hi Eno!");
  }

//   使用Object.defineProperty来解决 严格相等情况===
var value = 1;
Object.defineProperty(window, "a", {
  get() {
    return this.value++;
  }
});

if (a === 1 && a === 2 && a === 3) {
  console.log("Hi Eno!");
}

// 使用隐藏字符去做障眼法瞒过面试官
var aﾠ = 1;
var a = 2;
var ﾠa = 3;
if (aﾠ == 1 && a == 2 && ﾠa == 3) {
  console.log("Hi Eno!");
}
