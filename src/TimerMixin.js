/*
 *  Copyright (c) 2015-present, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 *
 */
'use strict';

var GLOBAL = require('./shared').GLOBAL;
var setter = require('./shared').setter;
var clearer = require('./shared').clearer;

var TIMEOUTS_ID = require('./shared').TIMEOUTS_ID
var INTERVALS_ID = require('./shared').INTERVALS_ID
var IMMEDIATES_ID = require('./shared').IMMEDIATES_ID
var RAFS_ID = require('./shared').RAFS_ID

var _clearTimeout = require('./shared')._clearTimeout
var _setTimeout = require('./shared')._setTimeout
var _clearInterval = require('./shared')._clearInterval
var _setInterval = require('./shared')._setInterval
var _clearImmediate = require('./shared')._clearImmediate
var _setImmediate = require('./shared')._setImmediate
var _cancelAnimationFrame = require('./shared')._cancelAnimationFrame
var _requestAnimationFrame = require('./shared')._requestAnimationFrame

var TimerMixin = {
  componentWillUnmount: function() {
    this[TIMEOUTS_ID] && this[TIMEOUTS_ID].forEach(function(id) {
      GLOBAL.clearTimeout(id);
    });
    this[TIMEOUTS_ID] = null;
    this[INTERVALS_ID] && this[INTERVALS_ID].forEach(function(id) {
      GLOBAL.clearInterval(id);
    });
    this[INTERVALS_ID] = null;
    this[IMMEDIATES_ID] && this[IMMEDIATES_ID].forEach(function(id) {
      GLOBAL.clearImmediate(id);
    });
    this[IMMEDIATES_ID] = null;
    this[RAFS_ID] && this[RAFS_ID].forEach(function(id) {
      GLOBAL.cancelAnimationFrame(id);
    });
    this[RAFS_ID] = null;
  },

  setTimeout: _setTimeout,
  clearTimeout: _clearTimeout,

  setInterval: _setInterval,
  clearInterval: _clearInterval,

  setImmediate: _setImmediate,
  clearImmediate: _clearImmediate,

  requestAnimationFrame: _requestAnimationFrame,
  cancelAnimationFrame: _cancelAnimationFrame,
};

module.exports = TimerMixin;
