// We are using the async module
var async = require('async');

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
    // bind to self and push to list
    self.funcList.push(func.bind(self));
  }
};

Middleware.prototype.go = function (func) {
  var self = this;

  if (isFunction(func)) {
    self.finalFunc = func.bind(self);
  }

  async.series(self.funcList, self.finalFunc)
};

module.exports = Middleware;
