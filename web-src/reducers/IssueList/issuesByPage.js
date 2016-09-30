import {
  REQUEST_ISSUES, RECEIVE_ISSUES
} from '../../actions/IssueList/'
import { CLICK_PAGE } from '../../actions/Pagination/'

function issuesByPage(state = {
  isFetching: false,
  didInvalidate: false
}, action) {
  switch (action.type) {

  case REQUEST_ISSUES:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false
    })

  case RECEIVE_ISSUES: {
    let { pageId } = action.conditions
    let { items } = action.issues

    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false,
      nowPageId: pageId,
      [`page-${pageId}`]: {
        id: pageId,
        items: items.map( item => item.id )
      }
    })
  }

  case CLICK_PAGE: {
    const pageId = action.pageId
    return Object.assign({}, state, {
      nowPageId: pageId
    })
  }

  default:
    return state
  }
}

export default issuesByPage
