import {
  RECEIVE_ISSUES
} from '../actions/'

const issues = (state = {}, action = {items: []}) => {
  switch (action.type) {

  case RECEIVE_ISSUES: {
    let items = {}
    action.issues.items.map( (issue) => {
      items[issue.id] = issue
    })
    return Object.assign(
      {}, state, items)
  }
  default:
    return state
  }
}

export default issues
