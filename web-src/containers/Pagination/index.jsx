import React, { Component } from 'react'
import { connect } from 'react-redux'
import Pagination from '../../components/Pagination/'
import { clickPage, setPageBtnDisabled } from '../../actions/Pagination/'
import { fetchIssuesIfNeeded } from '../../actions/IssueList/'

class Container extends Component {

  constructor (props) {
    super(props)
    this.onClickPageBtn = this.onClickPageBtn.bind(this)
  }

  componentDidMount () {
  }

  onClickPageBtn (pageId) {
    const { dispatch, nowPageId, pagum } = this.props
    let target = pageId
    switch(pageId) {
    case -1:
      target = nowPageId - 1
      break;
    case -2:
      target = nowPageId + 1
      break;
    }
    if (target <= 1) dispatch(setPageBtnDisabled([-1, 1]))
    else if (target >= pagum) dispatch(setPageBtnDisabled([-2, pagum]))
    dispatch(setPageBtnDisabled(target))
    dispatch(fetchIssuesIfNeeded(target))
    dispatch(clickPage(target))
  }

  render () {
    return <Pagination {...this.props} onClickPageBtn={this.onClickPageBtn}/>
  }
}

const mapStateToProps = (state, ownProps) => {
  return state.pagination
}

const VisiblePagination = connect(
  mapStateToProps
)(Container)

export default VisiblePagination
