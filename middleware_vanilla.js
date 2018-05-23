function Middleware() {
  this.funcList = [];
  this.finalFunc = function () {};
}

isFunction = function(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};

Middleware.prototype.use = function (func) {
  var self = this;
  if (isFunction(func)) {
    // push to list
    self.funcList.push(func);
  }
};

Middleware.prototype.go = function (func) {
  var self = this;

  if (isFunction(func)) {
    self.finalFunc = func;
  }

  // List of functions wrapped in callback order
  // actually it will contain just one function
  // which is the final wrapper
  var wrapperList = [];

  // wrap the finalFunc and push to the wrapper list
  wrapperList.push(function () {
    self.finalFunc.apply(self, arguments);
  });

  for (var i = self.funcList.length - 1; i >= 0; i--) {
    // (i+1)th function will be the next function for (i)th function
    var wrapper = (function () {
      // pop the next call wrapper from list
      // which is actully next call wrapped (i+1)th function
      var next = wrapperList.pop();
      var func = self.funcList[i];
      // wrap (i+1)th function as next for (i)th function
      return function () {
        func.call(self, next);
      };
    })();

    // push the wrapped (i)th function to the list
    wrapperList.push(wrapper);
  }

  wrapperList.pop().call(self);
};

module.exports = Middleware;
