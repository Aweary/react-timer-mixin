/*
 *  Copyright (c) 2015-present, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 *
 */

var GLOBAL = typeof window === 'undefined' ? global : window;

var TIMEOUTS_ID = 'TimerMixin_timeouts';
var INTERVALS_ID = 'TimerMixin_intervals';
var IMMEDIATES_ID = 'TimerMixin_immediates';
var RAFS_ID = 'TimerMixin_rafs';

var setter = function(_setter, _clearer, array) {
  return function(callback, delta) {
    var id = _setter(function() {
      _clearer.call(this, id);
      callback.apply(this, arguments);
    }.bind(this), delta);

    if (!this[array]) {
      this[array] = [id];
    } else {
      this[array].push(id);
    }
    return id;
  };
};

var clearer = function(_clearer, array) {
  return function(id) {
    if (this[array]) {
      var index = this[array].indexOf(id);
      if (index !== -1) {
        this[array].splice(index, 1);
      }
    }
    _clearer(id);
  };
};

var _clearTimeout = clearer(GLOBAL.clearTimeout, TIMEOUTS_ID);
var _setTimeout = setter(GLOBAL.setTimeout, _clearTimeout, TIMEOUTS_ID);

var _clearInterval = clearer(GLOBAL.clearInterval, INTERVALS_ID);
var _setInterval = setter(GLOBAL.setInterval, function() {/* noop */}, INTERVALS_ID);

var _clearImmediate = clearer(GLOBAL.clearImmediate, IMMEDIATES_ID);
var _setImmediate = setter(GLOBAL.setImmediate, _clearImmediate, IMMEDIATES_ID);

var _cancelAnimationFrame = clearer(GLOBAL.cancelAnimationFrame, RAFS_ID);
var _requestAnimationFrame = setter(GLOBAL.requestAnimationFrame, _cancelAnimationFrame, RAFS_ID);


module.exports = {
  setter: setter,
  clearer: clearer,
  GLOBAL: GLOBAL,
  TIMEOUTS_ID: TIMEOUTS_ID,
  INTERVALS_ID: INTERVALS_ID,
  IMMEDIATES_ID: IMMEDIATES_ID,
  RAFS_ID: RAFS_ID,
  _clearTimeout: _clearTimeout,
  _setTimeout: _setTimeout,
  _clearInterval: _clearInterval,
  _setInterval: _setInterval,
  _clearImmediate: _clearImmediate,
  _setImmediate: _setImmediate,
  _cancelAnimationFrame: _cancelAnimationFrame,
  _requestAnimationFrame: _requestAnimationFrame
}
