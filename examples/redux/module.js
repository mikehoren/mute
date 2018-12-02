import {
  createAction,
  handleActions,
} from 'redux-actions'

import {
  fromJS,
  replace,
} from '../../src'

const defaultState = fromJS({
  info: {
    name: 'Info 0',
    value: 0,
  },
  meta: {
    name: 'Meta 0',
    value: 0,
  }
})

const UPDATE_INFO = 'mute/example/UPDATE_INFO'
const UPDATE_META = 'mute/example/UPDATE_META'

export const updateInfo = createAction(UPDATE_INFO, value => ({ value }))
export const updateMeta = createAction(UPDATE_META, value => ({ value }))

const reducer = handleActions({
  [UPDATE_INFO]: (state, { payload }) => {
    const value = payload.value + 1
    state.info.name = `Info ${ value }`
    state.info.value = value
    return replace(state)
  },
  [UPDATE_META]: (state, { payload }) => {
    const value = payload.value + 1
    state.meta.name = `Info ${ value }`
    state.meta.value = value
    return replace(state)
  },
}, defaultState)

export default reducer