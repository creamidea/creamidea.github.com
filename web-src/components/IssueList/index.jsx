import React from 'react'
import VisibleIssueList from '../../containers/IssueList/VisibleList'
import VisiblePagination from "../../containers/Pagination/"

const IssueListApp = () => (
  <div>
    <h1>Issue List</h1>
    <VisibleIssueList />
    <VisiblePagination />
  </div>
)

export default IssueListApp
