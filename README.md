## 模块一：函数式编程与JS异步编程、手写Promise
# 简答题
1. 谈谈你是如何理解JS异步编程的，EventLoop、消息队列都是做什么的，什么是宏任务，什么是微任务？

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