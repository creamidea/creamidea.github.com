import React, { Component } from 'react'
import { connect } from 'react-redux'
import IssueList from '../components/List'
import { fetchIssuesIfNeeded } from '../actions/'

class ListContainer extends Component {

  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  componentDidMount () {
    const { dispatch } = this.props
    dispatch(fetchIssuesIfNeeded(1))
  }

  onClick (filter) {
    const { dispatch } = this.props
    dispatch(setVisibilityFilter(filter))
    console.log(filter)
  }

  render () {
    return <IssueList {...this.props} />
  }
}

const getIssueByPage = (issuesByPage, page) => {
  return issuesByPage[page]
}

const getAllIssues = (issues) => {
  return {}
}

const setVisibilityFilter = (filter) => {
  switch(filter) {
  case "SHOW_BY_PAGE":
    return getIssueByPage(issuesByPage, issuesByPage.nowPage)
  }
}

const mapStateToProps = (state = {}, ownProps) => {
  let { issues, issuesByPage } = state
  let { totalCount, incompleteResults, nowPageId } = issuesByPage
  if ( nowPageId && nowPageId > 0) {

    return Object.assign({}, state,{
      totalCount,
      incompleteResults,
      items: issuesByPage[`page-${nowPageId}`].items.map( id => issues[id] )
    })

  } else {

    return state

  }
}

const VisibleIssueList = connect(
  mapStateToProps
)(ListContainer)

export default VisibleIssueList
