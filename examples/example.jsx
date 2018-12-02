import React from 'react'
import ReactDOM from 'react-dom'
import store from './redux/store'
import { connect, Provider } from 'react-redux'

import {
  updateInfo,
  updateMeta,
} from './redux/module'

import {
  infoSelector,
  metaSelector,
} from './redux/selectors'

class Main extends React.PureComponent {

  render() {
    const {
      info,
      meta,
      updateInfo,
      updateMeta,
    } = this.props 
    return (
      <div>
        <div>
          <p>{ info.name }</p>
          <p>{ info.value }</p>
        </div>
        <div>
          <p>{ meta.name }</p>
          <p>{ meta.value }</p>
        </div>
        <button onClick={ () => updateInfo(info.value) }>Increment Info</button>
        <button onClick={ () => updateMeta(meta.value) }>Increment Meta</button>
      </div>
    )
  }

}

const mapStateToProps = state => {
  return ({
    info: infoSelector(state),
    meta: metaSelector(state),
  })
}

const mapDispatchToProps = {
  updateInfo,
  updateMeta,
}

const App = connect(mapStateToProps, mapDispatchToProps)(Main)

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>
, document.getElementById('application'))