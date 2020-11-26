// global.js 将此文件放在要全局注册的components文件夹下   

import Vue from 'vue'
import { homedir } from 'os'

// 首字母大写
function changeStr(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

// require.context  webpack的api  获取当前文件
const requireComponent = require.context('.', false,/\.vue$/)

// 遍历多有component文件 
requireComponent.keys().forEach(fileName => {
    // 获取文件名
    const config = requireComponent(fileName)
    const componentName = changeStr(fileName.replace(/^\.\//, '').replace(/\.w+$/, ''))
    // vue全局注册组件
    Vue.component(componentName, config.defalut || config)
})


// 可以用同样的原理  全局注册路由

// 把有子路由的路由单独写成文件模块js， 然后用require.context  获取各个路由模块，在router.js里面遍历导入所有模块

// router.js

const routerList = []

function importAll (r) {
    r.keys().forEach(key => {
        routerList.push(r[key].defalut)
    })
}

// 引入所有单独编写的路由模块文件
importAll(reqiure.context('./router', true, /\.routes\.js/))

export default new Router({
    routes: [
        ...routerList,
        {
            path: '/',
            name: 'home',
            component: () => {}
        }
    ]
})

// 单独的路由模块  setting.routes.js

export default {
        path: '/',
        name: 'home',
        component: () => {},
        children: []
    
}