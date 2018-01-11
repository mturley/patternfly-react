import React from 'react';

export const bindMethods = (context, methods) => {
  methods.forEach(method => {
    context[method] = context[method].bind(context);
  });
};

// Returns a subset of the given object including only the given keys, with values optionally replaced by a fn.
export const selectKeys = (obj, keys, fn = val => val) =>
  keys.reduce((values, key) => ({ ...values, [key]: fn(obj[key]) }), {});

// Returns a subset of the given object with a validator function applied to its keys.
export const filterKeys = (obj, validator) =>
  selectKeys(obj, Object.keys(obj).filter(validator));

// Returns an object with the same keys as the given one, but all null values.
export const nullValues = obj => selectKeys(obj, Object.keys(obj), () => null);

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
  ControlledComponent.propTypes = {
    ...WrappedComponent.propTypes,
    ...stateTypes
  };
  ControlledComponent.defaultProps = WrappedComponent.defaultProps;
  return ControlledComponent; // TODO use recompose withState or withStateHandlers here instead of component state above
};

export const noop = Function.prototype;
