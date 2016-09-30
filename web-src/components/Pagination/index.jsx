import React, { PropTypes } from "react"
import PageButton from "./PageButton"

const Pagination = ({buttons, onClickPageBtn, nowPageId}) => {
  return (
    <div className="btn-group">
      {buttons.map((btn, i) => {
        return <PageButton key={btn.pageId}
                             {...btn}
                             onClick = {() => onClickPageBtn(btn.pageId)}/>
        })}
    </div>
  )
}

Pagination.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.shape({
    pageId: PropTypes.number,
    text: PropTypes.string,
    onClickPage: PropTypes.func
  })),
  nowPageId: PropTypes.number,
  onClickPageBtn: PropTypes.func
}

export default Pagination
      // <PageButton key={"pervious"} text="Previous"
      //             onClick = {() => onClickPageBtn(nowPageId - 1)} />
      //   {buttons.map((btn, i) => {
      //     return <PageButton key={btn.pageId}
      //                          {...btn}
      //                          onClick = {() => onClickPageBtn(btn.pageId)}/>
      //     })}
      // <PageButton key={"next"} text="Next"
      //             onClick = {() => onClickPageBtn(nowPageId + 1)}/>
