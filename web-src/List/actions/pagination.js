export const CLICK_PAGE = 'CLICK_PAGE'
export function clickPage (pageId) {
  return {
    type: CLICK_PAGE,
    pageId
  }
}

export const PAGE_DID_RENDER = 'PAGE_RENDERED'
export function pageDidRender () {
  return {
    type: PAGE_DID_RENDER
  }
}

export const SET_PAGE_BTN_DISABLED = 'SET_PAGE_BTN_DISABLED'
export function setPageBtnDisabled (pageIds) {
  return {
    type: SET_PAGE_BTN_DISABLED,
    pageIds
  }
}
