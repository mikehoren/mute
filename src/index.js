export const PROXY_KEY = '__proxy__'

// create a Proxy from an object

export function create(obj, original, parent = null, referenceKey = null) {

  // if we're dealing with a primitive value or a function there is no need to proxy, simply return it
  if(!obj || isPrimitive(obj) || isFunction(obj)) {
    return obj
  }

  // ensure non-proxy objects
  obj = unwrap(obj)

  let _obj;

  const handler = {
    // this is here for inspection
    origin: obj,
    // handle calling methods on an object
    apply(target, thisArg, argumentsList) {
      if(target) {
        return target.apply(thisArg, argumentsList)
      }
    },
    // when getting a properties value
    get(obj, prop) {
      try {
        // if the key is the unique value assigned to proxies return the key
        // this key is used for proxy detection
        if(prop === PROXY_KEY) {
          return true
        }
        // if the key is not a proxy attempt to create a proxy, consider this
        // lazy proxy generation
        if(!obj[prop][PROXY_KEY]) {
          obj[prop] = create(obj[prop], original, _obj, prop)
        }
        // return the value
        return obj[prop]
      } catch(err) {
        return
      }  
    },
    // setting the value on a proxy
    set(obj, prop, value) {
      try {
        // recreate the proxy based on the value, this ensures setting a value
        // will set a unique object if we're dealing with a non-primitive or function
        obj[prop] = create(value, original, obj, prop)
        // if there is a parent walk up the tree to ensure parents reflect they're changed as well
        if(parent && referenceKey) {
          // this is implicit recursion, because we're setting a value set() is run again on the parent object
          parent[referenceKey] = obj
        }
      } catch(err) {
        return false
      }
      return true
    },
    // return the expected result for Object.keys
    ownKeys(target) {
      return Reflect.ownKeys(target)
    }
  }

  _obj = new Proxy(obj, handler)

  return _obj

}

// this is used to replace a Proxy object with a new proxy object
// this is useful in reducer methods when returning the new state
export function replace(obj) {
  if(isPrimitive(obj) || isFunction(obj)) {
    return obj
  }

  let _obj;

  if(Array.isArray(obj)) {
    _obj = obj.concat([])
  } else {
    let keys = obj[PROXY_KEY] ? Reflect.ownKeys(obj) : Object.keys(obj)
    _obj = {}
    keys.forEach( k => {
      _obj[k] = obj[k]
    })
  }

  return fromJS(_obj)

}

// this unwraps a Proxy and returns a raw object with it's keys
export function unwrap(obj) {

  if(isPrimitive(obj) || isFunction(obj)) {
    return obj
  }

  let _obj;

  if(Array.isArray(obj)) {
    _obj = obj.map( v => unwrap(v))
  } else {
    let keys = obj[PROXY_KEY] ? Reflect.ownKeys(obj) : Object.keys(obj)
    _obj = {}
    keys.forEach( k => {
      _obj[k] = unwrap(obj[k])
    })
  }

  return _obj
}

// returns true if the value is a primitive value
export function isPrimitive(value) {
  const type = typeof value
  return value === null || (type !== 'object' && type !== 'function')
}

// returns true if the object is a function
export function isFunction(obj) {
  return typeof obj === 'function'
}

// create a Proxy from an object
// this should be used as oppose to create() in actual usage
export function fromJS(obj) {
  return create(obj, obj)
}
