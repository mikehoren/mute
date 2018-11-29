export const PROXY_KEY = '__proxy__'

export function create(obj, original, parent = null, referenceKey = null) {

  if(!obj || isPrimitive(obj) || isFunction(obj)) {
    return obj
  }

  let _obj;

  const handler = {
    origin: obj,
    apply(target, thisArg, argumentsList) {
      if(target) {
        return target.apply(thisArg, argumentsList)
      }
    },
    get(obj, prop) {
      try {
        if(prop === PROXY_KEY) {
          return true
        }
        if(!obj[prop][PROXY_KEY]) {
          obj[prop] = create(obj[prop], original, _obj, prop)
        }
        return obj[prop]
      } catch(err) {
        return
      }  
    },
    set(obj, prop, value) {
      try {
        obj[prop] = create(value, original, _obj, prop)
        if(parent && referenceKey) {
          const t = unwrap(_obj)
          parent[referenceKey] = t
        }
      } catch(err) {
        return false
      }
      return true
    },
    ownKeys(target) {
      return Reflect.ownKeys(target)
    }
  }

  _obj = new Proxy(obj, handler)

  return _obj

}

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

export function isPrimitive(value) {
  const type = typeof value
  return value === null || (type !== 'object' && type !== 'function')
}

export function isFunction(obj) {
  return typeof obj === 'function'
}

export function fromJS(obj) {
  return create(obj, obj)
}
