// redux是状态管理器

// 状态就是数据， 比如计数器中的count

let state = {
    count： 1
}

// 使用状态
console.log(state.count)

// 修改状态
state.count = 2

// 上面有一个明显的问题： 修改count之后，使用count的地方不能收到通知。可以使用发布-订阅模式来解决这个问题

// --------------count的发布订阅者实现------------------------

let state = {
    count： 1
}
// 订阅队列
let listeners = []

// 订阅
function subscribe(listener) {
    listeners.push(listener)
}

function changeCount (count) {
    state.count = count
    // 当count改变的时候，要通知所有的订阅者
    for(let i = 0; i<listeners.length; i++) {
        const listener = listeners[i]
        listener()
    }
}

// ----------------尝试使用这个简单的计数器状态管理----------------------------

// 订阅下，当count改变时，要实时输出新值
subscribe(()=> {
    console.log(state.count)
})

//  修改count, 不能直接修改，要使用changeCount修改
changeCount(2)   // 2
changeCount(3)   // 3
changeCount(4)   // 4

// -------------------------------------------------------
// 现在有两个新的问题
// 1、这个状态管理器只能管理count，不能公用
// 2、 公共代码要封装起来

const createStore = function(initState) {
    let state = initState
    let listeners = []  // 订阅者们的数组队列

    // 订阅
    function subscribe(listener) {
        listeners.push(listener)
    }

    function changeState(newState) {
        state = newState
        // 通知所有的订阅者
        listeners.map(item => {
            item()
        })
    }
    // 获取state的方法
    function getState() {
        renturn state
    }
    return {
        subscribe,
        changeState,
        getState
    }
}

// ----------------使用这个状态管理器管理多个状态 counter和info试试---------------------

let initStae = {
    counter: {
        count: 0
    },
    info: {
        name: '',
        description: ''
    }
}

let store = createStore(initState)

store.subscribe(()=> {
    let state = store.getState()
    console.log(`${state.info.name}:${state.info.description}`)
})

store.changeState({
    ...store.getState(),
    {
        info:'前端九部',
        description: '前端爱好者'
    }
})

store.changeState({
    ...store.getState(),
    counter:{
        count: 1
    }
})

//-------------完成了一个简单是状态管理器--------------

// -------------有计划的状态管理器-------------------
// 用上面的状态管理器来实现一个自增，自减的计数器

let initState = {
    count: 0
}

let store = createStore(initState)

store.subscribe(()=> {
    let state = store.getState()
    console.log(state.count)
})

store.changeState({
    count: store.getState().count++
})

store.changeState({
    count: store.getState().count--
})

store.changeState({
    count: 'abc'
})

// 你一定发现了问题， count被修改成了‘abc’字符串，因为没有任何约束，任何地方，任何人都可以修改
// 我们需要约束， 不允许计划外的count修改， 只允许count自增或自减

// 分两步解决问题
// 1、制定一个state修改计划，告诉store， 我的修改计划是什么
// 2、修改store.changeState方法，告诉他修改state的时候，按照计划修改

// 设置一个plan函数，接受现在的state，和一个action，返回经过改变后的新的state

// 注意： action = {type:'', other: ''},action必须有一个type属性
 function plan(state, action) {
     switch(action.type) {
         case 'INCREMENET':
             renturn {
                 ...state,
                 count: state.count+ 1
             }
         case 'DECRMENT':
            renturn {
                ...state,
                count: state.count- 1
            }
        defalut：
            return state
     }
 }

 // 把这个假话告诉store， store.changeState以后改变state要按照这个计划来

 // 增加一个参数

 const createStore(plan, initState) {
     const state = initState
     let listeners = []
     function subscribe(listener) {
        listeners.push(listener)
     }
     function getState() {
         return state
     }
     function changeState(action) {
        state = plan(state, action)
        for(let i = 0; i<listeners.length; i++) {
            const listener = listeners[i]
            listener()
        }
     }
     return {
         suscribe,
         changState,
         getState
     }
 }

 // 使用新的createStore实现自增和自减
 let initState = {
     count: 0
 }

 let store = createStore(plan, initState)

 store.subscribe(() => {
     let state = store.getState()
     console.log(state.store)
 })

 //自增
 store.changeState({
     type: 'INCREMENET'
 })
 // 自减
 store.changeState({
    type: 'DECRMENT'
 })

 //  已经实现了一个有计划的状态管理器， plan命名为 reducer  changeState命名为dispatch

 // ----------------------------多文件协作-------------------------------------
 // reducer 的拆分和合并
 // 我们知道reducer是一个计划函数，接收老的state，按计划返回新的state。在实际项目中， 有大量的state，每个state都需要计划函数
 // 如果所有的计划卸载一个reducer函数里面，会导致reducer函数及其庞大复杂。按经验来说，按组件维度来拆分出很多个reducer函数， 然后通过一个函数来把他们合并起来

 // 我们来管理两个state， 一个counter，一个info
 let state ={
     counter: {
         count: 0
     },
     info:{
         name: '前端九部',
         description: '前端爱好者'
     }
 }

 // 他们各自的reducer

 // counterReducer , 一个子reducer
 // 注意： counterReducer接受的state是state.counter

 function counterReducer(state, action) {
     switch(action.type){
         case 'INCREMENET':
             return {
                 count:state.count+ 1
             }
         case 'DECRMENT':
                return {
                    ...state.count,
                    count:state.count- 1
                }
         defalut:
            return state
     }
 }

 
 // infoReducer , 一个子reducer
 // 注意： infoReducer接受的state是state.info
function infoReducer(state, action) {
    switch(action.type) {
        case 'SET_NAME':
            return {
                ...state,
                name:action.name
            }
        case 'SET_DESCRIPTION':
            return {
                ...state,
                description:action.description
            }
        defalut:
            return state
    }
}

// 用combineReducers函数来把多个reducer合并成一个reducer函数

const reducer = combineReducers({
    counter: counterReducer,
    info:infoReducer
})

// 尝试实现下combineReducerd函数
 function combineReducers(reducers) {
    // reducerKeys = ['counter', 'info']
    const reducerKeys = Object.keys(reducers)

    // 返回合并后的新函数
    return function combination(state = {}, action) {
        // 生成新的state
        const nextState = {}
        // 遍历执行所有的reducers，整合成为一个新的state
        for(let i = 0; i<reducers.length; i++) {
            const key = reducers[i]
            const reducer  = reducers[key]
            // 之前key的state
            const previousStateForKey = state[key]
            // 执行 分 reducer，获得新的state
            const nextStateForKey = reducer(previousStateForKey, action)
            nextState[key] = nextStateForKey
        }
        return nextState
    }
 }

 // -------------------使用combineReducers-------------------------

 const reducer = combineReducers({
    counter: counterReducer,
    info:infoReducer
})

let initState ={
    counter: {
        count: 0
    },
    info:{
        name: '前端九部',
        description: '前端爱好者'
    }
}

let store = createStore(reducer, initSa=tate)
store.subscribe(() => {
    let state = store.getState()
    console.log(state.store)
})

 //自增
 store.dispatch({
    type: 'INCREMENET'
})

// 修改
store.dispatch({
    type: 'SET_NAME',
    name: '前端九部'
})

// ------------------state的拆分和合并--------------------
// 我们把reducer按组件拆分了，通过combineReducers合并了
// 还有一个问题，state还是写在一起的，这样会造成state树很庞大
// 需要拆分，一个state，一个reducer， 写一块

// counter自己的state和reducer写在一起

let initState = {
    count: 0
}

function counterReducer(state, action) {
    // 注意： 如果state没有初始值， 那就给他初始值
    if(!state) {
        state = initState
    }
    switch (action.type) {
        case 'INCREMENET':
             return {
                 count:state.count+ 1
             }
        case 'DECRMENT':
                return {
                    ...state.count,
                    count:state.count- 1
                }
        defalut:
            return state
    }
}

// 修改下createStore函数， 增加一行dispatch（{type：Symbol（）}）

const createStore(reducer, initState) {
    const state = initState
    let listeners = []
    function subscribe(listener) {
       listeners.push(listener)
    }
    function getState() {
        return state
    }
    function changeState(action) {
       state = reducer(state, action)
       for(let i = 0; i<listeners.length; i++) {
           const listener = listeners[i]
           listener()
       }
    }
    // 用一个不匹配任何计划的type，来获取初始值
    dispatch({type: Symbol()})
    return {
        suscribe,
        changState,
        getState
    }
}

// 思考下这行可以带来什么？
// createStore的时候，用一个不匹配任何type的action，来触发state= reducer(state, action)
// 因为action.type不匹配，每个子reducer都会进到default项，返回自己初始化的state

// ---------------------middleware----------------------------
// 中间件是对dispatch的扩展，或者说重写， 增强diapatch功能

// 记录日志

// 有一个需求，在每次修改state'的时候，记录下来修改前的state，为什么修改了，一级修改后的state
// 可以通过重写store.dispatch实现

const store = createStore(reducer)
const next = store.dispatch

// 重写了store.dispatch
store.diapatch = (action)=> {
    console.log('this state', store.getState())
    console.log('action', action)
    next(action)
    console.log('next state', store.getState())
}

// 使用
store.dispatch({
    type: 'INCREMENET'
})

// 日志输出
 this state {counter: {count: 0}}
 action {type: 'INCREMENET'}
 1
 next state {counter: {count: 1}}

 //  记录日常
 // 一个需求，需要每次记录数据出错的原因
 const store = createStore(reducer)
 const next = store.dispatch
 store.diapatch = (action)=> {
     try{
        next(action)
     }catch(err) {
        console.log('next state', err)
     }
 }

 // -----------------------多中间件的合作--------------------------

 store.diapatch = (action)=> {
    try{
        console.log('this state', store.getState())
        console.log('action', action)
        next(action)
        console.log('next state', store.getState())
    }catch(err) {
       console.log('next state', err)
    }
}

// 如果需求很多，是不能卸载一个函数里的
// 需要考虑如何实现扩展性很强的多中间件合作模式

// 1、把loggerMiddleware提取出来

const store = createStore(reducer)
const next = store = store.dispatch
const loggerMiddleware = (action)=> {
    console.log('this state', store.getState())
    console.log('action', action)
    next(action)
    console.log('next state', store.getState())
}

store.diapatch = (action)=> {
    try{
        loggerMiddleware(action)
    }catch(err) {
       console.log('next state', err)
    }
}

// 2、把exceptionMiddleware提取出来
const exceptionMiddleware = (action)=> {
    try{
        loggerMiddleware(action)
    }catch(err) {
       console.log('next state', err)
    }
}

// 3、现在代码有一个很严重的问题，就是exceptionMiddleware里面写死了loggerMiddleware
// 我们需要让next(action)变成动态的，随便哪个中间件都可以

const exceptionMiddleware = (next)=>(action)=> {
    try{
        next(action)
    }catch(err) {
       console.log('next state', err)
    }
}
// loggerMiddleware 变成参数传进去
store.dispatch = exceptionMiddleware(loggerMiddleware)

// 同样的道理， loggerMiddleware里面的next现在恒等于 store.dispatch， 无法扩展别的中间件，需要把next携程动态的
const loggerMiddleware = (next) =>(action)=> {
    console.log('this state', store.getState())
    console.log('action', action)
    next(action)
    console.log('next state', store.getState())
}

// 一个扩展性很高的中间件模式
const store = createStore(reducer)
const next = store.dispatch

const loggerMiddleware = (next) =>(action)=> {
    console.log('this state', store.getState())
    console.log('action', action)
    next(action)
    console.log('next state', store.getState())
}

const exceptionMiddleware = (next)=>(action)=> {
    try{
        next(action)
    }catch(err) {
       console.log('next state', err)
    }
}

store.dispatch = exceptionMiddleware(loggerMiddleware(next))

// 这时候想把两个中间件放到独立的文件中
// 但是中间件中包含了外部变量store， 所以要把store作为参数传进去
const store = createStore(reducer)
const next = store.dispatch

const loggerMiddleware = (store)=>(next) =>(action)=> {
    console.log('this state', store.getState())
    console.log('action', action)
    next(action)
    console.log('next state', store.getState())
}

const exceptionMiddleware = (store) =>(next)=>(action)=> {
    try{
        next(action)
    }catch(err) {
       console.log('next state', err)
    }
}

const logger = loggerMiddleware(store)
const exception = exceptionMiddleware(store)
store.dispatch = exception(logger(next))

// 现有一个需求，在打印日志之前输出当前时间戳，用中间件实现

const timeMidleware = (store) => (next) => (action) => {
    console.log('time', new Date().getTime())
    next(action)
}

const time = timeMidleware(store)
store.dispatch = exception(time(logger(next)))

// 中间件使用方式优化
// 中间件的使用方式不是很友好
import loggerMiddleware from './middlewares/loggerMiddleware';
import exceptionMiddleware from './middlewares/exceptionMiddleware';
import timeMiddleware from './middlewares/timeMiddleware';

//...

const store = createStore(reducer);
const next = store.dispatch;

const logger = loggerMiddleware(store);
const exception = exceptionMiddleware(store);
const time = timeMiddleware(store);
store.dispatch = exception(time(logger(next)));

// 其实只需要知道三个中间件，剩下的细节都可以封装起来，通过扩展createStore实现

// 期望的用法

// 接收旧的createStore，返回新的createStore
const newCreateStore = applyMiddleware(exceptionMiddleware, timeMiddleware,loggerMiddleware)(createStore)
// 返回了一个diapstch被重写过的createStore

const store = newCreateStore(reducer)

// 实现applyMiddleware

const applyMiddleware = function(...middlewares) {
    // 返回一个重写createStore的方法
    return function rewriteCreateStoreFunc(oldCreateStore) {
        // 返回重写后新的ceateStore
        return function(reducer, initState){
             // 1、生成store
            const store = oldCreateStore(reducer, initState)
            // 给每一个middleware传下store， 相当于 const logger = loggerMiddleware(store)
            // const chain = ['exception', 'time','logger']
            const chain = middlewares.map(middleware => middleware(store))
            let dispatch = store.dispatch
            // 实现exception(time(logger(next)))
            chain.reverse().map(middlewares => {
                dispatch = middlewares(dispatch)
            })
            // 重写dispatch
            store.dispatch = dispatch
            return store
        } 
    }
}

// 现在还有个小问题，我们有两种createStore

// 没有中间件的createStore
import {createStore} from './redux'
const store = createStore(reducer, initState)

// 有中间件的createStore
const rewriteCreateStoreFunc = allyMiddleware(exceptionMiddleware, timeMiddleware, loggerMiddleware)
const newCreateStore = rewriteCreateStoreFunc(createStore)
const store = newCreateStore(reducer, initState)

// 可以方便统一起来，修改createStore方法

const createStore = function(reducer, initState, rewriteCreateStoreFunc) {
    // 如果有rewriteCreateStoreFunc 就采用新的createStore
    if(rewriteCreateStoreFunc){
        const newCreateStore = rewriteCreateStoreFunc(createStore)
        const store = newCreateStore(reducer, initState)
    } else {
        // 否则就按正常流程走
    }
}
// 最终用法

const rewriteCreateStoreFunc = allyMiddleware(exceptionMiddleware, timeMiddleware, loggerMiddleware)
const store = createStore(reducer, initState, rewriteCreateStoreFunc)

// --------------------------完整的redux------------------------------------

// 退订
// 修改store.subscribr方法，增加退订功能
function subscribe(listener) {
    listeners.push(listener)
    return function unsubscribe() {
        const index = listeners.indexOf(listener)
        listeners.splice(index, 1)
    }
}

// 使用
const unsubscribe = store.subscribe(() => {
    let state = store.getState();
    console.log(state.counter.count)
})
unsubscribe()

// 中间件那到的store
// 现在的中间件拿到了完整的 store，他甚至可以修改我们的 subscribe 方法，按照最小开放策略，我们只用把 getState 给中间件就可以了！因为我们只允许你用 getState 方法
// 修改下 applyMiddleware 中给中间件传的 store

const simpleStore = {getState: store.getState}
const chain = middlewares.map(middleware => middleware(simpleStore))

// ---------------compose------------------------------
// 我们的applyMiddleware中，把[A,B,C]转换成A(B(C))，是这样实现的

const chain = [A,B,C]
let dispatch = store.dispatchchain.reverse().map(middleware=> {
    dispatch = middleware(dispatch)
})

// redux提供了一个compose方法，可以做这个事情
const chain = [A,B,C]
dispatch= compose(...chain)(store.dispatch)

// 实现原理

export default function compose(...func) {
    if(func.length ===1) {
        return func[0]
    }
    return func.reduce((a,b)=>(...args)=> a(b(...args)))
}

// 省略initState
// 有时候创建store的时候不传initState
const store = createStore(reducer, {}, rewriteCreateStoreFunc)
// redux允许我们这样写
const store = createStore(reducer,rewriteCreateStoreFunc)
// 我们仅需要改下 createStore 函数，如果第二个参数是一个object，我们认为他是 initState，如果是 function，我们就认为他是 rewriteCreateStoreFunc
function craeteStore(reducer, initState, rewriteCreateStoreFunc){
    if (typeof initState === 'function'){
    rewriteCreateStoreFunc = initState;
    initState = undefined;
  }
  //...
}

// 2行代码的replaceReducer

//reducer拆分后，和组件是意义对应的。我们就希望在做按需加载的时候，renducer也可以跟着组件在必要的时候再加在，然后用心的reducer替换老的reducer
const createStore = function (reducer, initState) {
    // ...
    function replaceReducer(newReducer) {
        reducer = newReducer
        // 刷新一遍state的值，新来的erducer把自己默认的状态放到state树上去
        dispatch({type:Symbol()})
    }
    // ...
    return {
        //..
        replaceReducer
    }
}
// 使用
const reducer = combineReducers({
    counter: counterReducer
})
const store = createStore(reducer)
/*生成新的reducer*/
const nextReducer = combineReducers({
    counter: counterReducer,
    info: infoReducer
  });
  /*replaceReducer*/
store.replaceReducer(nextReducer)

// ----------------------------bindActionCreators----------------------
// bindActionCreators一般很少用到，只有在react-redux的connect实现中用到
// 他通过闭包，把dispatch和actionCreator隐藏起来，让其他地方感知不到redux的存在

const reducer = combineReducers({
    counter: counterReducer,
    info: infoReducer
  });
  const store = createStore(reducer);
  
  /*返回 action 的函数就叫 actionCreator*/
  function increment() {
    return {
      type: 'INCREMENT'
    }
  }
  
  function setName(name) {
    return {
      type: 'SET_NAME',
      name: name
    }
  }
  
  const actions = {
    increment: function () {
      return store.dispatch(increment.apply(this, arguments))
    },
    setName: function () {
      return store.dispatch(setName.apply(this, arguments))
    }
  }

  // 注意：我们可以把 actions 传到任何地方去
  // 其他地方在实现自增的时候，根本不知道 dispatch，actionCreator等细节
  actions.increment(); /*自增*/
actions.setName('九部威武'); /*修改 info.name*/

// 这个 actions 生成的时候，好多公共代码，提取一下
const actions = bindActionCreators({ increment, setName }, store.dispatch)
// 来看一下 bindActionCreators 的源码，超级简单（就是生成了刚才的 actions）
// 核心代码，通过闭包隐藏了actionCreator和dispatch
function bindActionCreator(actionCreator, dispatch) {
    return function () {
        return dispatch(actionCreator.apply(this, arguments))
    }
}
// actionCreateors必须是function或者object
export default function bindActionCreators(actionCreators, dispatch) {
    if(typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators, dispatch)
    }
    if(typeof actionCreators !== 'object' || actionCreators === null) {
        throw new Error()
    }

    const keys = Object.keys(actionCreators)
    const boundActionCreator = {}
    for(let i =0; i<keys.length; i++) {
        const key = key[i]
        const actionCreator = actionCreators[key]
        if (typeof actionCreator === 'function') {
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
          }
    }
    return boundActionCreators
}