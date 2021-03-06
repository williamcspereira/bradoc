(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.bradoc = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/bradoc')

},{"./lib/bradoc":2}],2:[function(require,module,exports){
/*
 * bradoc
 * 
 *
 * Copyright (c) 2013 Ju Goncalves
 * Licensed under the MIT license.
 */

 'use strict';

var cpfdoc = require('./cpf');
var cnpjdoc = require('./cnpj');
var val = require('./valid');

var doc = function(doc){

  return {
    validate: function(number){
      number = doc.deformat(number);
      return val.is(doc,number);
    },

    generate : function(){
      return doc.format(doc.gen());
    }
  };
};

exports.cpf = doc(cpfdoc);
exports.cnpj = doc(cnpjdoc);
},{"./cnpj":3,"./cpf":4,"./valid":6}],3:[function(require,module,exports){
'use strict';

var gen = require('./gen');
var val = require('./valid');

exports.checksum = function(digits) {
  if(digits.length !== 12 && digits.length !== 13){
    return null;
  }

  var weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  if (digits.length !== 12)
    weights.unshift(6);

  var sum = 0;
  var code, checksum;

  digits.forEach(function(el, index){
    sum += el * weights[index];
  });

  code = sum % 11;
  checksum = code < 2 ? 0 : 11 - code;

  return checksum;
};

exports.genChecksum = function(digits){
  if(!(digits instanceof Array) && digits){
    return null;
  }

  digits.push(this.checksum(digits));
  digits.push(this.checksum(digits));

  return digits;
};

exports.type = function(){
  return 'cnpj';
};

exports.gen = function(){
  var cnpj = gen.digits(12);

  return this.genChecksum(cnpj);
};

exports.format = function(cnpj){
  var regex = /^([\d]{2})([\d]{3})([\d]{3})([\d]{4})([\d]{2})$/;
  
  return val.format(cnpj, regex, '$1.$2.$3/$4-$5');
};

exports.deformat = val.deformat;

},{"./gen":5,"./valid":6}],4:[function(require,module,exports){
'use strict';

var gen = require('./gen');
var val = require('./valid');

exports.checksum = function(digits) {
  
  if(digits.length !== 9 && digits.length !== 10){
    return null;
  }

  var sum = 0;
  var code, checksum;
  var counter = digits.length === 9 ? 10 : 11;

  digits.forEach(function(el){
    sum = sum + (el * counter);
    counter = counter - 1;
  });

  code = sum % 11;
  checksum = code < 2 ? 0 : 11 - code;

  return checksum;
};

exports.genChecksum = function(digits){
  if(!(digits instanceof Array)){
    return null;
  }

  digits.push(this.checksum(digits));
  digits.push(this.checksum(digits));

  return digits;

};

exports.type = function(){
  return 'cpf';
};

exports.gen = function(){
  var cpf = gen.digits(9);

  return this.genChecksum(cpf);
};

exports.format = function(cpf){
  var regex = /^([\d]{3})([\d]{3})([\d]{3})([\d]{2})$/;

  return val.format(cpf, regex, '$1.$2.$3-$4');
};

exports.deformat = val.deformat;
},{"./gen":5,"./valid":6}],5:[function(require,module,exports){
'use strict';

exports.digits = function(number) {
  if(number !== 9 && number !== 12){
    return null;
  }

  var array = [];
  var i = 0;

  for(; i < number; i++){
    array.push(1 + Math.floor(Math.random() * 9));
  }

  return array;
};
},{}],6:[function(require,module,exports){
'use strict';

exports.is = function(doc, toval){
  if(!(toval instanceof Array) && doc.type() !== 'doc' && doc.type !== 'cnpj'){
    return false;
  }

  var limit = doc.type() === 'cpf' ? 9 : 12;

  if(toval.length - 2 > limit || toval.length - 2 < limit){
    return false;
  }

  var csgen = doc.genChecksum(toval.slice(0,limit));

  if(csgen[limit] === toval[limit] && csgen[limit + 1] === toval[limit + 1]){
    return true;
  }

  return false;
};

exports.format = function(doc, regex, replace){
  if(!(doc instanceof Array)){
    return null;
  }

  doc = doc.join('').replace(regex, replace);

  return doc;
};

exports.deformat = function(doc){
  var check = typeof doc === 'string';
  if(!check){
    return null;
  }

  var regex = /[^0-9]+/g;
  doc = doc.replace(regex, '');

  var i = 0,
      docArray = [];

  for(; i <= doc.length - 1; i++){
    docArray.push(parseInt(doc[i], 0));
  }

  return docArray;
};
},{}]},{},[1])(1)
});