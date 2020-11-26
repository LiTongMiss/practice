
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(f) {
    this.result = null
    this.state = PENDING
    this.callbacks = []

    let onFulfilled = value => transition(this,FUFILLED, value)
    let onRejected = reason => transition(this, REJECTED,reason)

    let ignore = false
    let resolve = value => {
        if(ignore) return
        ignore = true
        resolvePromise(this, value, onFulfilled, onRejected)
    }

    let reject = reason => {
        if(ignore) return
        ignore = true
        onRejected(reason)
    }

    try{
        f(resolve,reject)
    } catch(error) {
        reject(error)
    }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
        let callback = {onFulfilled, onRejected,resolve,reject}

        if(this.state === PENDING) {
            this.callbacks.push(callback)
        } else {
            setTimeout(() => handleCallback(callback, this.state, this.result), 0)
        }
    })
}

const handleCallback = function(callback, state, result) {
    let {onFulfilled, onRejected, resolve, reject} = callback
    try{
        if(state === FULFILLED) {
            isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
        } else if(state === REJECTED) {
            isFuntion(onRejected) ? reject(onRejected(result)) : reject(result)
        }
    }catch(error) {
        reject(error)
    }   
}

const reslovePromise = function(promise, result, resolve, reject) {
    if(result === promise) {
        let reason = new TypeError('Can not fulfill promise with itself')
        return reject (reason)
    }

    if(isPromise(result)) {
        return result.then(resolve, reject)
    }

    if(isThenable(result)) {
        try {
            let then = reslut.then
            if(isFuntion(then)) {
                return new Promise(then.bind(this)).then(resolve,reject)
            }
        } catch(error){
            reject(error)
        }
    }
    resolve(result)
}

const handleCallbacks = (callback, state, result) => {
    while (callback.length) handleCallback(callbacks.shift(), state, result)
}

const transition = (promise, state, result) => {
    if(promise.state !== PENDING) return
    promise.state = state
    promise.result = result
    setTimeout(()=> handleCallbacks(promise.callbacks,state, result))
}


// ---------------es2015Promise--------------------------
Promise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected)
}

Promise.resolve = value => new Promise(resolve => resolve(value))
Promise.reject = reason => new Promise((_, reject) => reject(reason))