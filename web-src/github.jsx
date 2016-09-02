import React from 'react'
import Fetch from './fetch'

const { Component } = React

const PROTOCOL = 'https'
const APIHOST = 'api.github.com'
const ISSUEPATH = '/search/issues'

let Github = ComposedComponent => class extends Fetch(Component) {
  constructor () {
    super()
    this.state = {
    }
  }

  getIssue (page = 1, perPage = 10) {
    let url = `${PROTOCOL}://${APIHOST}${ISSUEPATH}?q=author:creamidea&sort=updated&page=${page}&per_page=${perPage}`
    return this.fetch(url)
  }

  componentDidMount () {
  }

  render () {
    return <ComposedComponent {...this.props} fetch={this.fetch}/>
  }
}

export default Github
