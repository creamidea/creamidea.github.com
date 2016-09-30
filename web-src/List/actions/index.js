import fetch from 'isomorphic-fetch'
import receiveFailed from './receiveFailed'

let PERPAGECOUNT = 25
const PROTOCOL = 'https'
const APIHOST = 'api.github.com'
const ISSUEPATH = '/search/issues'
const AUTHOR = 'creamidea'

/**
 * request params:
 * @page
 * @perPageCount
 */
export const REQUEST_ISSUES = 'REQUEST_ISSUES'
function requestIssues (conditions) {
  return {
    type: REQUEST_ISSUES,
    requestAt: Date.now(),
    conditions
  }
}

/**
 * receive issues:
 * return
 * the request result (has extract the object)
 */
export const RECEIVE_ISSUES = 'RECEIVE_ISSUES'
function receiveIssues (issues, conditions) {
  return {
    type: RECEIVE_ISSUES,
    receiveAt: Date.now(),
    conditions,
    issues
  }
}

/**
 * filter issues:
 */
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
export function setVisibilityFilter (filter) {
  return {
    type: SET_VISIBILITY_FILTER,
    filter
  }
}

/**
 * fetch issues:
 */
export function fetchIssues (pageId = 1, perPageCount = PERPAGECOUNT) {
  return function (dispatch) {
    dispatch(requestIssues({pageId, perPageCount}))

    return fetch(`${PROTOCOL}://${APIHOST}${ISSUEPATH}?q=author:${AUTHOR}&sort=updated&page=${pageId}&per_page=${perPageCount}`)
      .then(response => response.json())
      .then(json =>
            dispatch(receiveIssues(json, {pageId, perPageCount})))
      .catch(error =>
             dispatch(receiveFailed(error)))
  }
}

function shouldFetchIssues (state, pageId) {
  const page = state.issuesByPage[`page-${pageId}`]
  if (!page) return true
  else if (page.isFetching) return false
  else return page.didInvalidate
}

export function fetchIssuesIfNeeded(pageId) {
  return (dispatch, getState) => {
    if (shouldFetchIssues(getState(), pageId))
      return dispatch(fetchIssues(pageId))
  }
}
