/**
 * **IssueList** is a list showing visible issues.
 *     + issues: Array is an array of issue items with {id, title, comment, repository, update\_at/close\_at, state}

 * **Issue** is a single issue item.
 *     + id: number
 *     + title: string
 *     + comment: number is the number of the comments
 *     + repository: string
 *     + update\_at/close\_at: string
 *     + state: [:open :close]

 * **Search** is a fliter for user to find the issue he/she concerned about.
 *     + conditions: string
 *     + onClick()
 *     + inputEnter()

 * **TopStateBar** is the state of the issuelist
 *     + number of open issue
 *     + number of close issue

 * **Pagination** is to control the number of per page

 * **App** is the root component that renders everything else.
 */

import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import IssueListApp from './List/components/'
import IssueReducer from './List/reducers/'

const loggerMiddleware = createLogger()
const rootReducer = combineReducers(
  Object.assign({}, IssueReducer))

let store = createStore(
  combineReducers(rootReducer, applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  ))
)

render(
  <Provider store={store}>
    <IssueListApp />
  </Provider>,
  document.getElementById('app')
)
