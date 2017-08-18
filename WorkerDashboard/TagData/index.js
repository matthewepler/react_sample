import React, { Component } from 'react'
import { css } from 'aphrodite/no-important'
import { initIBMClient, initSubscriptions } from './IBMClient'
import { activityIndicators } from './topics'
import mapRange from 'utils/mapRange'
import random from 'lodash/random'

import Card from 'components/Dashboard/Card'
import DataIconRow from 'components/Dashboard/DataIconRow'
import { animateTag, init3D } from './Tag3D'
import styles from './styles'

import vectorTable from './vectorTable'

export default class TagData extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false,
      battery: '-',
      altitude: '-',
      humidity: '-',
      lastHeard: 0,
      micLevel: '500',
      objLoaded: false,
      currOrientation: {x: 0, y: 0, z:0},
      serverConnected: false,
      tagConnected: false,
      tagId: null,
      temperature: '-'
    }
    this.IBMAppClient = null

    this.heartbeatInterval = null
    this.heartbeatTimer = 1000
    this.activeThreshold = 10000 // how long before a tag is considered inactive

    this.micLevelWidth = 100

    this.tag3Did = 'tag3D'

    this.handleBrokerDisconnect = this.handleBrokerDisconnect.bind(this)
  }

  componentDidMount () {
    // TODO: get worker's Tag ID# - API call for this ???
    // TODO: how is this re-rendered if a new worker is called? Tie to store
    // so a change there triggers re-render here. Should receive currWorker...?

    this.IBMAppClient = initIBMClient()
    this.IBMAppClient && this.IBMAppClient.connect()
    this.setIBMHandlers(this.IBMAppClient)

    // 3D Tag
    init3D(this.tag3Did).then(result => {
      !this['_calledComponentWillUnmount'] && this.setState({ objLoaded: result })
    })

    // setInterval(this.updateOrientation, 1000)
  }

  setIBMHandlers (IBMAppClient) {
    IBMAppClient.on('connect', () => {
      !this['_calledComponentWillUnmount'] && this.setState({ serverConnected: true })
      initSubscriptions(IBMAppClient, this.state.tagId) // replace with tagID
      this.heartbeatInterval = setInterval(this.checkHeartbeat(), this.heartbeatTimer)
    })
    IBMAppClient.on('deviceEvent', (deviceType, deviceId, eventType, format, payload) => {
      // payload is an array of integers and needs coercing
      // const data = JSON.parse(String(payload))
      // console.log(deviceId, eventType)
      if (!this.state.tagConnected) {
        !this['_calledComponentWillUnmount'] && this.setState({ tagConnected: true })
      }

      !this['_calledComponentWillUnmount'] && this.setState({ lastHeard: Date.now() })
    })
    IBMAppClient.on('disconnect', this.handleBrokerDisconnect)
  }

  handleBrokerDisconnect () {
    !this['_calledComponentWillUnmount'] && this.setState({ serverConnected: false })
    this.disconnect()
  }

  componentWillUnmount () {
    this.IBMAppClient.disconnect()
    this.disconnect()
  }

  disconnect () {
    clearInterval(this.heartbeatInterval)
  }

  checkErrorStatus (stateItem) {
    return css(
      stateItem ? styles.default : styles.error,
    )
  }

  checkConnectionStatus () {
    return css(
      !this.state.tagConnected || !this.state.serverConnected
        ? styles.offline
        : ''
    )
  }

  calcMicLevel () {
    return mapRange(this.state.micLevel, 0, 1023, 0, this.micLevelWidth)
  }

  checkHeartbeat () {
    const diff = Date.now() - new Date(this.state.lastHeard).getTime()
    if (diff > this.activeThreshold) {
      !this['_calledComponentWillUnmount'] && this.setState({ tagConnected: false })
    }
  }

  updateOrientation (num) {
    num = random(1, 48, false) // for testing only
    animateTag(vectorTable[num])
  }

  render () {
    return (
      <Card title='Tag Data' width='500' height='fixedHeight' marginRight >

        {/* 3D tag */}
        <div id={this.tag3Did} onClick={this.updateOrientation.bind(this)} />

        <div className={css(styles.tagDataWrapper)}>
          {/* Server Connection (IBM MQTT Broker) */}
          <DataIconRow
            iconClass={`fa fa-server 
              ${css(styles.statusIcon)} 
              ${this.checkErrorStatus(this.state.serverConnected)}`}
            spanClass={this.checkErrorStatus(this.state.serverConnected)}
            textString={`Server ${this.state.serverConnected ? 'Connected' : 'Disconnected'}`}
            data-test='server-connection-status'
          />

          {/* Tag Connection */}
          <DataIconRow
            iconClass={`fa fa-link 
              ${css(styles.statusIcon)} 
              ${this.checkErrorStatus(this.state.tagConnected)}`}
            spanClass={this.checkErrorStatus(this.state.tagConnected)}
            textString={`Tag ${this.state.tagConnected ? 'Connected' : 'Disconnected'}`}
            data-test='tag-connection-status'
          />

          {/* Active/Inactive */}
          <DataIconRow
            iconClass={`fa fa-arrows 
              ${css(styles.statusIcon)}  
              ${this.checkErrorStatus(this.state.active)}
              ${this.checkConnectionStatus()}`}
            spanClass={`
              ${this.checkErrorStatus(this.state.active)}
              ${this.checkConnectionStatus()}`}
            textString={`${this.state.active ? 'Active' : 'Inactive'}`}
          />

          {/* Altitude */}
          <DataIconRow
            iconClass={`fa fa-arrow-up 
                ${css(styles.statusIcon)} 
                ${this.checkConnectionStatus()}`}
            spanClass={`
              ${css(styles.default)} 
              ${this.checkConnectionStatus()}`}
            textString={`${this.state.altitude} ft`}
          />

          {/* Temperature */}
          <DataIconRow
            iconClass={`fa fa-thermometer-three-quarters 
                ${css(styles.statusIcon)}
                ${this.checkConnectionStatus()}`}
            spanClass={`
              ${css(styles.default)}
              ${this.checkConnectionStatus()}`}
            textString={`${this.state.temperature} °F`}
          />

          {/* Humidity */}
          <DataIconRow
            iconClass={`fa fa-tint 
                ${css(styles.statusIcon)}
                ${this.checkConnectionStatus()}`}
            spanClass={`
              ${css(styles.default)}
              ${this.checkConnectionStatus()}`}
            textString={`${this.state.humidity}%`}
          />

          {/* Battery Level */}
          <DataIconRow
            iconClass={`fa fa-battery-three-quarters 
                ${css(styles.statusIcon)}
                ${this.checkConnectionStatus()}`}
            spanClass={`
              ${css(styles.default)}
              ${this.checkConnectionStatus()}`}
            textString={`${this.state.battery}%`}
          />

          {/* Mic Level */}
          <DataIconRow
            iconClass={`fa fa-volume-up 
                ${css(styles.statusIcon)}
                ${this.checkConnectionStatus()}`}
            spanClass={`
              ${css(styles.default)}
              ${this.checkConnectionStatus()}`}
            positionClass={css(styles.bottomDweller)}
            textString={`  ${this.state.micLevel}dB`}
            addOnElements={
              <svg width={this.micLevelWidth} height='10' xmlns='http://www.w3.org/2000/svg'>
                <line x1='0' y1='5' x2={this.micLevelWidth} y2='5' strokeWidth='1' stroke='grey' />
                <rect x='0' y='0' width={this.calcMicLevel()} height='10' fill='grey' />
              </svg>
            }
          />

        </div>
      </Card>
    )
  }
}
