import React from 'react';

export const bindMethods = (context, methods) => {
  methods.forEach(method => {
    context[method] = context[method].bind(context);
  });
};

const filterKeys = (obj, callback) =>
  Object.keys(obj)
    .filter(callback)
    .reduce((values, key) => ({ ...values, [key]: obj[key] }), {});
const nullValues = obj =>
  Object.keys(obj).reduce((values, key) => ({ ...values, [key]: null }), {});

/*
  controlled(stateTypes, defaults)(WrappedComponent)

  This Higher Order Component provides the controlled component pattern on a prop-by-prop basis.
  It's a nice way for components to implement internal state so they "just work" out of the box,
  but also give users the option of lifting some or all of that state up into their application.

  controlled() takes two arguments:
   * stateTypes - an object of PropTypes for the state that will be contained here
   * defaults - an optional object with default values for stateTypes
  
  The WrappedComponent will be rendered with special props:
   * setControlledState - a reference to this state wrapper's this.setState.
   * Props for all the stateTypes, from this.props if present or from this.state otherwise.
   * All other props passed to the controlled component HoC.
  
  The idea is that the values in stateTypes could be stored in state, or passed in via props.
  The WrappedComponent doesn't have to care which is being used, and can manage the state
  contained here. When present, props are used instead. If you provide these special props,
  be sure to also provide corresponding callbacks/handlers to keep them updated.
*/
export const controlled = (stateTypes, defaults = {}) => WrappedComponent => {
  class ControlledComponent extends React.Component {
    constructor() {
      super();
      this.state = { ...nullValues(stateTypes), ...defaults };
      bindMethods(this, ['setControlledState']);
    }
    setControlledState(updater) {
      this.setState(updater);
    }
    render() {
      const controlledStateProps = filterKeys(
        this.props,
        key => stateTypes.hasOwnProperty(key) && this.props[key] !== null
      );
      const otherProps = filterKeys(
        this.props,
        key => !stateTypes.hasOwnProperty(key)
      );
      return (
        <WrappedComponent
          setControlledState={this.setControlledState}
          {...this.state}
          {...controlledStateProps}
          {...otherProps}
        />
      );
    }
  }
  ControlledComponent.displayName = WrappedComponent.displayName;
  ControlledComponent.propTypes = WrappedComponent.propTypes;
  ControlledComponent.defaultProps = WrappedComponent.defaultProps;
  return ControlledComponent;
};

export const noop = Function.prototype;
