import {
  create,
  unwrap,
  PROXY_KEY,
} from '../src'

describe('Proxy Methods', () => {

  describe('create', () => {

    describe('return data', () => {

      it('returns undefined', () => {
        expect(create()).toEqual(undefined)
      })

      it('returns null', () => {
        expect(create(null)).toEqual(null)
      })

      it('returns a number', () => {
        expect(create(0)).toEqual(0)
      })

      it('returns string', () => {
        expect(create('a')).toEqual('a')
      })

      it('returns true', () => {
        expect(create(true)).toEqual(true)
      })

      it('returns false', () => {
        expect(create(false)).toEqual(false)
      })

      it('returns a function', () => {
        const fn = () => null
        expect(create(fn)).toEqual(fn)
      })

      it('returns a proxy object for an object', () => {
        const result = create({})
        expect(result[PROXY_KEY]).toEqual(true)
      })

      it('returns a proxy object for an array', () => {
        const result = create([])
        expect(result[PROXY_KEY]).toEqual(true)
      })

    })

    describe('proxy get', () => {

      it('creates proxy and primitives', () => {
        const fn1 = () => null
        const fn2 = () => null
        const result = create({
          a: {
            b: {
              c: {
                d: 1
              }
            },
          },
          c: 2,
          e: fn1,
          f: {
            g: fn2,
          },
          h: [1,2,3,4],
          i: [{ v: 1}, { v: 2 }, { v: 3 }],
        })
        expect(result.a[PROXY_KEY]).toEqual(true)
        expect(result.a.b[PROXY_KEY]).toEqual(true)
        expect(result.a.b.c[PROXY_KEY]).toEqual(true)
        expect(result.a.b.c.d).toEqual(1)
        expect(result.c).toEqual(2)
        expect(result.e).toEqual(fn1)
        expect(result.f[PROXY_KEY]).toEqual(true)
        expect(result.f.g).toEqual(fn2)
        expect(result.h[PROXY_KEY]).toEqual(true)
        expect(result.h[1]).toEqual(2)
        expect(result.i[PROXY_KEY]).toEqual(true)
        expect(result.i[1][PROXY_KEY]).toEqual(true)
        expect(result.i[1].v).toEqual(2)
      })

    })

    describe('proxy set', () => {

      it('sets a value on a proxy, walks up tree to recreate each object', () => {

        const result = create({
          a: {
            b: {
              c: 3
            }
          }
        })
        const a = result.a
        const b = result.b

        expect(result.a.b.c).toEqual(3)
        expect(result.a === a).toEqual(true)
        expect(result.b === b).toEqual(true)

        result.a.b.c = 4

        expect(result.a.b.c).toEqual(4)
        expect(result.a.b !== b).toEqual(true)
        expect(result.a !== a).toEqual(true)

      })

    })

    it('walks up tree to recreate each object for array methods', () => {

      const o = create({
        a: [1,2,3,4]
      })

      let a = o.a

      expect(o.a === a).toEqual(true)

      o.a.push(5)

      expect(o.a[4]).toEqual(5)
      expect(o.a !== a).toEqual(true)

      a = o.a

      expect(o.a === a).toEqual(true)

      o.a.pop()

      expect(o.a[4]).toEqual(undefined)
      expect(o.a !== a).toEqual(true)

      a = o.a

      expect(o.a === a).toEqual(true)

      o.a.unshift(5)

      expect(o.a[0]).toEqual(5)
      expect(o.a !== a).toEqual(true)

      a = o.a

      expect(o.a === a).toEqual(true)

      o.a.shift()

      expect(o.a[0]).toEqual(1)
      expect(o.a !== a).toEqual(true)

    })

  })

  describe('unwrap', () => {

    it('unwraps a proxy object and returns the non-proxy underlying data', () => {

      const fn1 = () => null
      const fn2 = () => null
      const result = create({
        a: {
          b: {
            c: {
              d: 1
            }
          },
        },
        c: 2,
        e: fn1,
        f: {
          g: fn2,
        },
        h: [1,2,3,4],
        i: [{ v: 1}, { v: 2 }, { v: 3 }],
      })
      expect(result.a[PROXY_KEY]).toEqual(true)
      expect(result.a.b[PROXY_KEY]).toEqual(true)
      expect(result.a.b.c[PROXY_KEY]).toEqual(true)
      expect(result.a.b.c.d).toEqual(1)
      expect(result.c).toEqual(2)
      expect(result.e).toEqual(fn1)
      expect(result.f[PROXY_KEY]).toEqual(true)
      expect(result.f.g).toEqual(fn2)
      expect(result.h[PROXY_KEY]).toEqual(true)
      expect(result.h[1]).toEqual(2)
      expect(result.i[PROXY_KEY]).toEqual(true)
      expect(result.i[1][PROXY_KEY]).toEqual(true)
      expect(result.i[1].v).toEqual(2)

      const u = unwrap(result)

      expect(u.a[PROXY_KEY]).toEqual(undefined)
      expect(u.a.b[PROXY_KEY]).toEqual(undefined)
      expect(u.a.b.c[PROXY_KEY]).toEqual(undefined)
      expect(u.a.b.c.d).toEqual(1)
      expect(u.c).toEqual(2)
      expect(u.e).toEqual(fn1)
      expect(u.f[PROXY_KEY]).toEqual(undefined)
      expect(u.f.g).toEqual(fn2)
      expect(u.h[PROXY_KEY]).toEqual(undefined)
      expect(u.h[1]).toEqual(2)
      expect(u.i[PROXY_KEY]).toEqual(undefined)
      expect(u.i[1][PROXY_KEY]).toEqual(undefined)
      expect(u.i[1].v).toEqual(2)

    })

  })

})