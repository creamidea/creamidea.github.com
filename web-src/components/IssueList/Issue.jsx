import React, { PropTypes } from 'react'

const Issue = ({ id, title, html_url, created_at, updated_at, closed_at, state, comments, number }) => (
  <li>
    <span className={`issue-state-${state}`}></span>
    <div className="issue-title">
      <a href={html_url}>{title}</a>
    </div>
    <div>{state === "open" ? `opened on ${created_at}`  : `closed on ${closed_at}`}</div>
    <div>comments: {comments}</div>
  </li>
)

Issue.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  html_url: PropTypes.string.isRequired,
  created_at: PropTypes.string,
  updated_at: PropTypes.string,
  closed_at: PropTypes.string,
  state: PropTypes.string.isRequired,
  comments: PropTypes.number.isRequired,
  number: PropTypes.number
}

export default Issue
