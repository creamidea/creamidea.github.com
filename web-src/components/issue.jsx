import React from 'react'
import Github from '../github'

const { Component } = React

class Content extends Component {

  constructor () {
    super()
    this.state = {}
  }

  render () {
    let { props } = this
    return (
      <li key={props.item.id}>{props.item.title}</li>
    )
  }

}

export default class IssueList extends Github(Component) {
  constructor () {
    super()
    this.state = {
      list: []
    }
  }

  componentDidMount () {
    let that = this
    this.getIssue(1)
      .then((json) => {
        that.setState({list: json.items})
      })
      .catch((err) => {
        console.error(err)
      })
  }

  render () {
    let {state} = this
    let contents = state.list.map((item) => {
      return (<Content key={item.id} item={item} />)
    })

    return (
      <div>
        <ul>{contents}</ul>
      </div>
    )
  }

}
