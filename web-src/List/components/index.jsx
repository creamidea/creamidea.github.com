import React from 'react'
import VisibleIssueList from '../containers/VisibleList'
import Pagination from '../containers/Pagination'

const IssueListApp = () => (
  <div>
    <h1>Issue List</h1>
    <VisibleIssueList />
    <Pagination />
  </div>
)


export default IssueListApp
