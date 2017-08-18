import React from 'react'
import { mount, render, shallow } from 'enzyme'
// import { renderer } from 'react-test-renderer'
import { fromJS } from 'immutable'
import { StyleSheetTestUtils } from 'aphrodite/no-important'
import TagData from './'

describe('TagData container snapshot', () => {
  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection()
  })
  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection()
  })

  it('renders the component', () => {
    const tree = renderComponent({}, 'shallow')
    expect(tree).toMatchSnapshot()
  })

  // @MATEO - this depends on a library completing a method successfully. Should
  // that be mocked? 
  it('creates an IBM client for connecting to MQTT broker', () => {
    const tree = renderComponent({}, 'mount')
    expect(tree.instance().IBMAppClient).not.toBeNull()
  })

  it('should display the server connection status', () => {
    const tree = renderComponent({}, 'shallow')
    tree.setState({ serverConnected: false })
    // these are brittle, sorrry. 
    expect(tree.find(sel('server-connection-status')).props().textString)
      .toEqual('Server Disconnected')
    tree.setState({ serverConnected: true })
    expect(tree.find(sel('server-connection-status')).props().textString)
      .toEqual('Server Connected')
  })

  it('should display the tag connection status', () => {
    const tree = renderComponent({}, 'shallow')
    tree.setState({ tagConnected: false })
    // these are brittle, sorrry. 
    expect(tree.find(sel('tag-connection-status')).props().textString)
      .toEqual('Tag Disconnected')
    tree.setState({ tagConnected: true })
    expect(tree.find(sel('tag-connection-status')).props().textString)
      .toEqual('Tag Connected')
  })

  it.skip('should render the data from the tag to the component', () => {
    // to be completed
  })
})

function renderComponent (props = {}, type) {
  const propsToUse = {
    // no default props
    ...props
  }
  switch (type) {
    case 'shallow':
      return shallow(<TagData {...propsToUse} />)
    case 'mount':
      return mount(<TagData {...propsToUse} />)
    default:
      throw new Error('you did not specify a render method')
  }
}

function sel (id) {
  return `[data-test="${id}"]`
}

// testing for IBM stuff too
// testing for Tag3D
