var React = require('react');
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

var globalTimeoutMethodsMap = {
  [TIMEOUTS_ID]: GLOBAL.clearTimeout,
  [INTERVALS_ID]: GLOBAL.clearInterval,
  [IMMEDIATES_ID]: GLOBAL.clearImmediate,
  [RAFS_ID]: GLOBAL.cancelAnimationFrame,
}

var LOCAL_TIMER_TYPES = [
  TIMEOUTS_ID,
  INTERVALS_ID,
  IMMEDIATES_ID,
  RAFS_ID
]


/**
 * A higher-order component that manages all timers in a closure.
 * The component itself does not retain a reference to the `timers`
 * object and only controls it indirectly through the setter/clearer
 * methods passed down via `props`.
 * @param {ReactComponent} wrappedComponent
 */

function timer(WrappedComponent) {

  var timers = {
    [TIMEOUTS_ID]: [],
    [INTERVALS_ID]: [],
    [IMMEDIATES_ID]: [],
    [RAFS_ID]: [],
  }

  var timerProps = {
    setTimeout: _setTimeout.bind(timers),
    clearTimeout: _clearTimeout.bind(timers),
    setInterval: _setInterval.bind(timers),
    clearInterval: _clearInterval.bind(timers),
    setImmediate: _setImmediate.bind(timers),
    clearImmediate: _clearImmediate.bind(timers),
    requestAnimationFrame: _requestAnimationFrame.bind(timers),
    cancelAnimationFrame: _cancelAnimationFrame.bind(timers),
  }

  return class TimerComponent extends React.Component {

    componentWillUnmount() {
      LOCAL_TIMER_TYPES.forEach(type => {
        const globalMethod = globalTimeoutMethodsMap[type];
        timers[type].forEach(id => globalMethod(id))
        timers[type] = null;
      });
      timers = null;
    }

    render() {
      const props = {...timerProps, ...this.props}
      return <WrappedComponent {...props} />
    }
  }
}

module.exports = timer;
