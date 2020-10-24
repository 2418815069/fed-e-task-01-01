## 模块一：函数式编程与JS异步编程、手写Promise
# 简答题
1. 谈谈你是如何理解JS异步编程的，EventLoop、消息队列都是做什么的，什么是宏任务，什么是微任务？
- js异步编程：为避免线程同步的问题，负责执行任务的线程只有一个，为解决耗时任务阻塞事件执行，采用异步编程。
- 异步编程：
  - 1.ajax请求
  - 2.promise异步方案
  - 3.setTimeout
  - 4.发布订阅与回调函数
- EventLoop(事件循环)：主线程从‘任务队列’中读取事件，这个过程是循环不断的，所以整个的事件机制又称事件循环
- 消息队列：每一个消息都与一个函数（回调函数callback）相关联。当栈为空时，从队列中取出一个消息进行处理。这个处理过程包含了调用与这个消息相关联的函数（以及因而创建了一个初始堆栈帧）。当栈再次为空的时候，也就意味着消息处理结束。
- 宏任务：就是JS 内部（任务队列里）的任务，严格按照时间顺序压栈和执行。如 setTimeOut、setInverter、setImmediate 、 MessageChannel等
- 微任务：当前任务执行结束后立即执行的任务，例如需要对一系列的任务做出回应，或者是需要异步的执行任务而又不需要分配一个新的 任务 ，这样便可以减小一点性能的开销。
- promise异步方案

# 代码题
一.
```js
let a,b,c;
const promiseTest = new Promise((resolve, reject) => { 
  resolve();
})
console.log('promiseTest', promiseTest)
promiseTest.then(() =>{
   setTimeout(function () {
  a = 'hello'
  }, 10)
})
.then(() => {
  setTimeout(function () {
    b = 'lagou'
  }, 10)
}).then(() => {
  setTimeout(function () {
    c = 'I*U'
    console.log('33', a+b+c)
  }, 10)
})
```
二.基于以下代码完成下面的四个练习
练习1：
```js
const f = fp.flowRight(fp.prop('in_stock'), fp.last)
const isLastInStock = (cars) => {
  return f(cars)
}
```
练习2：
```js
const f = fp.flowRight(fp.prop('name'), fp.first)
const isFirstInStock = (cars) => {
  return f(cars)
}
```
练习4：
```js
const _underscore = fp.replace(/\W+/g, '_')
const sanitizeNames = (cars) => {
  return fp.flowRight(_underscore, fp.lowerCase)
}
sanitizeNames(['Hello World'])
```
四、手写实现promise
```js
const PENDING = 'pending'
const FULFILLED = 'fulfilled' // 成功
const REJECTED = 'rejected'

class MyPromise {
  constructor (executor) {
    executor(this.resolve, this.reject)
  }
  status = PENDING;
  // 成功之后的值
  value = '888'
  // 失败之后的原因
  reason = undefined
  successCallBack = []
  failCallBack = []
  resolve = (val) => {
    // 如果状态不是等待，阻止程序向下执行
    if (this.status !== PENDING) {
      return
    }
    this.value = val
    // 将状态改为成功
    this.status = FULFILLED
    while(this.successCallBack.length)
     {
       this.successCallBack.shift()(this.value)
      }
  }
  reject = (reason) => {
    if (this.status !== PENDING) {
      return
    }
    this.reason = reason
    // 将状态改为失败
    this.status = REJECTED
    // 实现then方法多次调用添加多个处理函数
    while (this.failCallBack.length) {
      this.failCallBack.shift()(this.reason)
    }
  }

  then = (successCallBack, failCallBack) => {
    // then方法的链式调用
    let promise2 = new MyPromise((resolve, rejected) => {
      // 判断状态
      if (this.status === FULFILLED) {
        // 将上一个回调函数的返回值传递给下一个回调
        const x = successCallBack(this.value);
        this.resolvePromise(x, resolve, reject)
      } else if(this.status === REJECTED) {
        failCallBack(this.reason)
      } else {
        if(successCallBack) this.successCallBack.push(successCallBack)
        if(failCallBack) this.failCallBack.push(failCallBack)
      }
    })
    
    return promise2
  }
  
   resolvePromise = (x, resolve, reject) => {
    if (x instanceof MyPromise) {
      // promise 对象
      x.then(() => {}, () => {})
    } else {
      // 普通值
      resolve(x)
    }
  }
  finally = () =>{
    if (this.status === PENDING) {
      return
    }
    // console.log()
  }
}
module.exports = MyPromise
```