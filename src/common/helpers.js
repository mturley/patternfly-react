export const bindMethods = (context, methods) => {
  methods.forEach(method => {
    context[method] = context[method].bind(context);
  });
};

/*
  This is a prop-by-prop implementation of the controlled component pattern.
  It's a nice way for components to implement internal state so they "just work" out of the box,
  but also give users the option of lifting some or all of that state up into their application.
  getControlledState() takes your props, your state, and an array of keys that could be in either.
  The returned object contains values for your keys from props where available,
  and from state with the same name otherwise. If you provide these special props,
  be sure to also provide corresponding callbacks/handlers to keep them updated.
*/
export const getControlledState = (props, state, keys) =>
  keys.reduce(
    (values, key) => ({
      ...values,
      [key]:
        props.hasOwnProperty(key) && props[key] !== null
          ? props[key]
          : state[key]
    }),
    {}
  );

export const noop = Function.prototype;
