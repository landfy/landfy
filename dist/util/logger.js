"use strict";

var error = function error(message) {
  console.log(message);
  return message;
};

module.exports = {
  error: error
};