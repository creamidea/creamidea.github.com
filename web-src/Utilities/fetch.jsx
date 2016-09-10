import { Component } from 'react'

let Fetch = ComposedComponent => class extends Component {

  constructor (props) {
    super(props)
  }

  componentDidMount () {

  }

  fetch (url, options = null) {
    return new Promise((resolve, reject) => {
      if (options && options.method === 'POST') {
        let ContentType = 'application/json'
        if (typeof options.body === 'object') {
          options.body = JSON.stringify(options.body)
        } else if (typeof options.body === 'string') {
          options.body = new FormData(options.body)
          ContentType = 'x-www-form-urlencoded'
        }
        options.headers = {
          'Content-Type': ContentType
        }
      }

      fetch(url, options).then((res) => {
        let contentType = res.headers.get('Content-Type')
        if (res.ok) {
          if (/text/.test(contentType)) {
            return res.text()
          } else if (/json/.test(contentType)) {
            return res.json()
          }
        } else {
          reject(res.statusText)
        }
      }).then((content) => {
        resolve(content)
      }).catch(error => { reject(error.message) })
    })
  }

  render () {
    // console.log('this.fetch', this.fetch);
    return <ComposedComponent {...this.props} fetch={this.fetch}/>
  }

}
export default Fetch
