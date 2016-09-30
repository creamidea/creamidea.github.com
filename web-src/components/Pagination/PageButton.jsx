import React, { PropTypes } from "react"

const PageButton = ({pageId, text, onClick, active, disabled}) => (
  <button type="button"
          key={pageId}
          onClick = {onClick}
          data-page-id={pageId}
          className = {active ? "btn active" : "btn"}
          disabled = {disabled}>
    {text}
  </button>
)

PageButton.propTypes = {
  pageId: PropTypes.number,
  text: PropTypes.string,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  disabled: PropTypes.bool
}

export default PageButton
