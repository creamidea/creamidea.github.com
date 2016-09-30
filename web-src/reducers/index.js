import { combineReducers } from 'redux'
import issues from './IssueList/issues'
import issuesByPage from './IssueList/issuesByPage'
import pagination from './Pagination'

const rootReducer = combineReducers({
  issues,
  issuesByPage,
  pagination
})

export default rootReducer
