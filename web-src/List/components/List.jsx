import React, { PropTypes } from 'react'
import Issue from './Issue'

const IssueList = ({ totalCount = 0, incompleteResults = false, items = [] }) => (
  <ul>
    {items.map(issue => (
      <Issue
         key={issue.id}
         {...issue}
         />
    ))}
  </ul>
)

IssueList.propTypes = {
  totalCount: PropTypes.number,
  incompleteResults: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    html_url: PropTypes.string.isRequired,
    created_at: PropTypes.stringd,
    updated_at: PropTypes.stringd,
    closed_at: PropTypes.stringd,
    state: PropTypes.string.isRequired,
    comments: PropTypes.number.isRequired,
    number: PropTypes.number
  }).isRequired)
}
export default IssueList
