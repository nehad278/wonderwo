"use strict";

var parallel = function(arr, callback) {
    callback = callback || function() {};
    if(arr.length == 0) {
        return callback;
    }
    var index = 0;
    var results = [];
    arr.forEach(function(fn) {
        fn(function(err, result) {
            if(err) {
                return callback;
            } else {
                index++;
                results.push(result);
                if(index >= arr.length) {
                    return callback(null, results);
                }
            }
        });
    });
}

module.exports = parallel;

if(require.main == module) {
    (function(){
        var asyncTask = function(num) {
            return function(cb) {
                setTimeout(function(){
                    console.log(num);
                    cb(null, num);
                }, Math.random()*1000);
            }
        }
        var tasks = [asyncTask(2),asyncTask(1),asyncTask(3),asyncTask(4)];
        parallel(tasks, console.log);
    })();
}