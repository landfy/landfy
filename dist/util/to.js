"use strict";

var to = function to(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).catch(function (err) {
    return [err];
  });
};

module.exports = to;