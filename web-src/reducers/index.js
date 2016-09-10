import { combineReducers } from 'redux'
import issues from './IssueList/issues'
import issuesByPage from './IssueList/issuesByPage'

const rootReducer = combineReducers({
  issues,
  issuesByPage
})

export default rootReducer
