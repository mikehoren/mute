import { createStore, combineReducers } from 'redux'
import example from './module'

const store = createStore(combineReducers({
  example,
}), {})

export default store