import React from 'react'
import { mount, render, shallow } from 'enzyme'
// import { renderer } from 'react-test-renderer'
import { fromJS } from 'immutable'
import { StyleSheetTestUtils } from 'aphrodite/no-important'
import { Component as WorkerInfo } from './'
import { currWorker, trades, projectGroups } from './jestFixtures'

let routerMock

describe('WorkerInfo container snapshot', () => {
  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection()
    routerMock = resetMockRouter()
  })
  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection()
    jest.resetAllMocks()
  })

  it('renders WorkerInfo component snapshot', () => {
    const tree = renderComponent()
    expect(tree).toMatchSnapshot()
  })

  it('renders worker data section when passed currWorker and trades data via props', () => {
    const tree = renderComponent()
    expect(tree.find(sel('worker-data-wrapper'))).toHaveLength(0)
    tree.setProps({ currWorker, trades })
    expect(tree.find(sel('worker-data-wrapper'))).toHaveLength(1)
  })

  it('renders the passed prop data for a worker correctly in the DOM', () => {
    const workerName = `${currWorker.get('firstname')} ${currWorker.get('lastname')}`
    const tree = renderComponent()
    tree.setProps({ currWorker, trades })
    expect(tree.find(sel('worker-name')).text()).toEqual(workerName)
  })

  it('does not render worker data that is null', () => {
    const tree = renderComponent()
    tree.setProps({ currWorker, trades })
    expect(tree.find(sel('worker-email'))).toHaveLength(1)

    let currWorkerMod = currWorker.merge(fromJS({ email: null }))
    tree.setProps({ currWorker: currWorkerMod })
    expect(tree.find(sel('worker-email'))).toHaveLength(0)
  })

  it('renders a list of workers with projectGroups prop', () => {
    const tree = renderComponent()
    tree.setProps({ currWorker, trades })
    tree.instance().createWorkerList(projectGroups)
    tree.instance().filterWorkerList()
    expect(tree.find(sel('search-results-li'))).toHaveLength(2)
  })

  it('filters search results based on this.state.searchStr', () => {
    const tree = renderComponent()
    tree.setProps({ currWorker, trades })
    tree.instance().createWorkerList(projectGroups)
    tree.setState({ searchStr: '2' })
    tree.instance().filterWorkerList()
    expect(tree.find(sel('search-results-li'))).toHaveLength(1)
    expect(tree.find(sel('search-results-li')).text()).toBe(
      `${projectGroups.get(1).getIn(['user', 'firstname'])} ${projectGroups.get(1).getIn(['user', 'lastname'])}`
    )
  })

  it('trigger fetch for new worker data when a search result is clicked', () => {
    const tree = renderComponent()
    tree.setProps({ currWorker, trades })
    tree.instance().createWorkerList(projectGroups)
    tree.instance().filterWorkerList()
    tree.instance().handleSearchResultClick = jest.fn()

    const firstResult = tree.find(sel('search-results-li')).first()
    firstResult.simulate('click')

    const resultsUser = projectGroups.first().getIn(['user', 'userStatuses']).first()

    expect(tree.instance().handleSearchResultClick).toHaveBeenCalledWith(
      resultsUser.get('userId'), resultsUser.get('groupId')
    )
  })
})

function renderComponent (props = {}) {
  const propsToUse = {
    router: routerMock,
    tradesFetch: () => {},
    workerInfoFetch: () => {},
    ...props
  }
  return shallow(<WorkerInfo {...propsToUse} />)
  // not passing anything via store because the component should still render
  // without it. instead, using setProps() to update component, mocking new data
  // from the parent <Dashboard /> component, passed when a new fetch is completed.
}

function sel (id) {
  return `[data-test="${id}"]`
}

function resetMockRouter () {
  return {
    params: { id: 1, clientId: 1 }
  }
}
