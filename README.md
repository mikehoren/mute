Mute
----

This library is an experiment using Proxy and the Reflect objects to build a library similar to immutable that allows the user to interact with objects in a mutable, natural way.

For an example of what this looks like in a React/Redux stack please see https://github.com/mikehoren/mute/tree/master/examples

Usage
-----

#### fromJS(obj)

Create a Proxy object chain from an object.  In usage this does not change how a developer might interact with this object, however, under the hood it will generate new objects as values change.

```javascript
const root = fromJS({
  a: {
    b: {
      c: 0
    }
  }
})
const old = root.a.b
root.a.b.c = 1
console.log(root.a.b === old) // ---> false
```

#### replace(obj)

Replace replaces a Proxy object with a new one. This is useful for returning a new version of state within reducers, or when you need to update a root object with a new Proxy.

```javascript
[REDUCER]: (state, { payload }) => {
  state.section.a.b = 1
  return replace(state)
}
```

#### unwrap(obj)

Unwraps a Proxy, walks through the tree and returns a fully unwrapped, Proxy-less new object.

```javascript
const pxy = fromJS({}) // ---> returns a Proxy object
const unwrapped = unwrap(pxy) ---> returns {} as a new object
```
