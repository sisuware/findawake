(function(){
  'use strict';
  
  var service = {
    info: consoleLogInfo,
    success: consoleLogSuccess,
    error: consoleLogError
  };

  module.exports = service;

  function consoleLogInfo(message, data) {
    console.log('\x1b[46m', 'FindAWake.' + Date.now() + ': ' + message, '\x1b[0m');
    _logData(data);
  }

  function consoleLogSuccess(message, data) {
    console.log('\x1b[42m', 'FindAWake.' + Date.now() + ': ' + message, '\x1b[0m');
    _logData(data);
  }

  function consoleLogError(message, data) {
    console.log('\x1b[41m', 'FindAWake.' + Date.now() + ': ' + message, '\x1b[0m');
    _logData(data);
  }

  function _logData(data) {
    if (data) {
      console.log('\x1b[2m',JSON.stringify(data),'\x1b[0m','\n');
    } 
  }
})();