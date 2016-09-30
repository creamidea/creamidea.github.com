import { RECEIVE_ISSUES } from '../actions/'
import { CLICK_PAGE, SET_PAGE_BTN_DISABLED } from '../actions/pagination'

const initButtons = (totalCount, perPageCount) => {
  if (perPageCount <= 0) perPageCount = 1

  try {
    var pagum = Math.ceil(totalCount / perPageCount)
  } catch(err) {
     return []
  }

  let buttons = Object.keys(new Int8Array(pagum+1)).map(Number).slice(1).map(
    (i) => {
      return {
        pageId: i,
        text: `${i}`,
        active: false,
        disabled: false
      }
    })
  buttons.unshift({pageId: -1, text: "Previous", disabled: false})
  buttons.push({pageId: -2, text: "Next", disabled: false})
  return {buttons, pagum}
}

const setBtnDisabled = ({pageIds, buttons}) => {
  return buttons.map((btn) => {
    btn.disabled = false
    if ((typeof pageIds === 'number' && pageIds === btn.pageId) ||
        (typeof pageIds === 'string' && pageIds === 'all') ||
        (pageIds instanceof Array && pageIds.include(btn.pageId)))
      btn.disabled = true
    else btn.disabled = false
    return btn
  })
}

const pagination = (state = {
  totalCount: 0, perPageCount: 0,
  buttons: [], nowPageId: 1,
  pagum: 0
}, action) => {
  switch (action.type) {

  case RECEIVE_ISSUES: {
    const totalCount = action.issues.total_count
    const { pageId, perPageCount } = action.conditions
    if (state.totalCount !== totalCount) {
      let {buttons, pagum} = initButtons(totalCount, perPageCount)
      return Object.assign({}, state.pagination, {
        totalCount,
        perPageCount,
        buttons,
        pagum,
        nowPageId: pageId
      })
    } else {
      return state
    }
  }

  case CLICK_PAGE: {
    const pageId = action.pageId
    return Object.assign({}, state, {
      nowPageId: pageId
    })
  }

  case SET_PAGE_BTN_DISABLED: {
    let buttons = setBtnDisabled({
      pageIds: action.pageIds,
      buttons: state.buttons
    })

    return Object.assign({}, state, {buttons})
  }

  default:
    return state
  }

}

export default pagination
