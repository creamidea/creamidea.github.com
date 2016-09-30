import React, { Component } from 'react'
import { connect } from 'react-redux'
import IssueList from '../../components/IssueList/List'
import { fetchIssuesIfNeeded } from '../../actions/IssueList/'

class ListContainer extends Component {

  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  componentDidMount () {
    const { dispatch } = this.props
    dispatch(fetchIssuesIfNeeded(1))
  }

  // componentWillReceiveProps(nextProps) {
  //   // debugger
  //   const { dispatch, pagination } = nextProps
  //   if (pagination && pagination.nowPageId !== this.props.pagination.nowPageId) {
  //     dispatch(fetchIssuesIfNeeded(pagination.nowPageId))
  //   }
  // }

  onClick (filter) {
    // const { dispatch } = this.props
    // dispatch(setVisibilityFilter(filter))
    console.log('[VisibleList]' + filter)
  }

  render () {
    return <IssueList {...this.props} />
  }
}

// const getAllIssues = (issues) => {
//   return {}
// }

// const setVisibilityFilter = (filter) => {
//   switch(filter) {
//   case "SHOW_BY_PAGE":
//     return getIssueByPage(issuesByPage, issuesByPage.nowPage)
//   }
// }

const mapStateToProps = (state = {}, ownProps) => {
  let { issues, issuesByPage } = state
  let { nowPageId } = issuesByPage
  let page = issuesByPage[`page-${nowPageId}`]

  if ( page ) {
    return Object.assign({}, issuesByPage, {
      items: page.items.map( id => issues[id] )
    })
  } else {
    return issuesByPage
  }
}

const VisibleIssueList = connect(
  mapStateToProps
)(ListContainer)

export default VisibleIssueList
