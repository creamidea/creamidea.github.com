import { REQUEST_ISSUES, RECEIVE_ISSUES } from '../actions/'

function issuesByPage(state = {}, action) {
  switch (action.type) {

  case REQUEST_ISSUES:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false
    })

  case RECEIVE_ISSUES: {
    let { pageId } = action.conditions
    let { total_count, incomplete_results, items } = action.issues

    return Object.assign({}, state, {
      totalCount: total_count,
      incompleteResults: incomplete_results,
      nowPageId: pageId,
      [`page-${pageId}`]: {
        id: pageId,
        isFetching: false,
        didInvalidate: false,
        items: items.map( item => item.id )
      }
    })
  }

  default:
    return state
  }
}

export default issuesByPage
