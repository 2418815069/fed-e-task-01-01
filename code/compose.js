// lodash 中的组合函数
// lodash 中组合函数 flow() 或者 flowRight()，他们都可以组合多个函数
// flow() 是从左到右运行
// flowRight() 是从右到左运行，使用的更多一些
function compose (f, g) { return function (x) { return f(g(x)) } }
function first (arr) { return arr[0] }
function reverse (arr) { return arr.reverse() }// 从右到左运行 
let last = compose(first, reverse) 
console.log(last([1, 2, 3, 4]))