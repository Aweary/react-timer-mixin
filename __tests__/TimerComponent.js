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

global.setImmediate = jest.genMockFunction();
global.clearImmediate = jest.genMockFunction();
global.requestAnimationFrame = jest.genMockFunction();
global.cancelAnimationFrame = jest.genMockFunction();

jest.dontMock('../src/shared');
jest.dontMock('../src/timer');
var React = require('react');
var mount = require('enzyme').mount;
var timer = require('../src/timer');
var globalTimeoutMethodsMap = require('../src/shared').globalTimeoutMethodsMap;

var setterMethods = [
  'setTimeout',
  'setInterval',
  'setImmediate',
  'requestAnimationFrame',
];

var clearerMethods = [
  'clearTimeout',
  'clearInterval',
  'clearImmediate',
  'cancelAnimationFrame',
];

var timerMethods = [
  ...setterMethods,
  ...clearerMethods
];

var clearerMap = {
  'setTimeout': 'clearTimeout',
  'setInterval': 'clearInterval',
  'setImmediate': 'clearImmediate',
  'requestAnimationFrame': 'cancelAnimationFrame',
}

let callback;

function renderWithTimerOptions(options = {}) {
  class Component extends React.Component {
    componentWillMount() {
      if (options.type) {
        this.props[options.type](callback, 10);
      }
    }
    render() {
      return (
        <div />
      )
    }
  }
  const WrappedComponent = timer(Component);
  return mount(<WrappedComponent />);
}

describe('TimerMixin', function() {

  beforeEach(() => {
    callback = jest.fn();
  });

  it('should render a wrapped component', () => {
    const wrapper = renderWithTimerOptions();
    expect(wrapper.find('Component').length).toBe(1);
  });

  timerMethods.forEach(type => {
    it(`should pass down a ${type} function`, () => {
      const wrapper = renderWithTimerOptions();
      const unwrapped = wrapper.find('Component');
      expect(typeof unwrapped.props()[type]).toEqual('function')
    });
  });

  setterMethods.forEach(type => {
    it(`should apply basic ${type} correctly`, () => {
      global[type].mockClear();
      global[type].mockReturnValue(1);
      const callback = jest.fn();
      const clearType = clearerMap[type];
      const wrapper = renderWithTimerOptions({ type, args: [callback, 10]})
      expect(
        typeof global[type].mock.calls[0][0]
      ).toEqual('function');
      expect(
        global[type].mock.calls[0][1]
      ).toEqual(10);
      expect(global[clearType]).not.toBeCalled();
      wrapper.unmount();
      expect(global[clearType]).toBeCalledWith(1);
    })
  })

});
