// 构建get请求
// superagent是node里面一个方便的客户端请求代理模块，用来代理请求非常方便

const superagent = require('superagent')
const api = 'https://movie.douban.com/j/search_subjects'
moudule.exports = (pageStart) => {
    return new Promise((resolve, reject)=> {
        superagent
        .get(api)
        .query({
            pageStart,
            type: 'tv',
            tag: '日本动画',
            sort: 'recommend',
            page_limit: 20
        })
        .type('form')
        .accept('application/json')
        .end((err,res)=>{
            if(err) reject(err)
            resolve(res)
        })
    })
}