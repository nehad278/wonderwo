"use strict";
var series = function(arr, callback) {
    callback = callback || function(){};
    if(arr.length == 0) {
        return callback;
    }
    var index = 0;
    var results = [];
    var iteratee = function() {
        arr[index](function(err, result) {
            if(err) {
                return callback(err);
            } else {
                index++;
                results.push(result);
                if(index >= arr.length) {
                    return callback(err, results);
                } else {
                    iteratee();
                }
            }

        });
    }
    iteratee();
}

module.exports = series;
if (require.main === module) {
    (function () {
      var asyncTask = function(num) {
          return function(cb) {
              setTimeout(function(){
                  console.log(num);
                  cb(null, num);
              }, Math.random()*1000);
          }
      }
      var tasks = [asyncTask(2),asyncTask(1),asyncTask(3),asyncTask(4)];
      series(tasks, console.log);
    })();
  }
  