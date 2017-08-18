import React, { Component } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important'

import Card from 'components/Dashboard/Card'
import { formatDateTime } from 'utils/formatDate'
import styles from './styles'

import fixtures from './fixtures'
import icons from './icons'

export default class Notifications extends Component {
  constructor () {
    super()
    this.state = {
      expanded: false,
      notifications: []
    }
  }

  componentDidMount () {
    let notifications = []
    fixtures(10).forEach((notification, i) => {
      notifications.push(
        <div key={i} className={css(styles.notificationWrapper)}>
          <img className={css(styles.icon)}
            src={icons[this.formatSVGfilename(notification.type, notification.read)]}
          />
          <div className={css(
              styles.dataWrapper,
              notification.read ? styles.dataRead : styles.dataUnread
            )} >
            <p className={css(styles.type)}>
              {notification.type}
            </p>
            <p className={css(styles.dateTime)}>
              {formatDateTime(notification.dateTime)}
            </p>
          </div>
        </div>
      )
    })
    this.setState({ notifications })
  }

  formatSVGfilename (type, read) {
    const regEx = new RegExp(/[^A-Z,a-z]+/, 'g')
    let typeString = type.toLowerCase().replace(regEx, '')

    if (read) {
      typeString = typeString + 'Black'
    } else {
      typeString = typeString + 'Orange'
    }
    return typeString
  }

  handleExpandClick () {
    this.setState({ expanded: !this.state.expanded })
  }

  render () {
    return (
      <Card title='Notifications' width='min'>
        <div className={css(
          this.state.expanded ? styles.scrollOff : styles.scrollOn)} >
          {this.state.notifications}
        </div>
        <div className={css(styles.expandButton)} onClick={this.handleExpandClick.bind(this)}>
          <i className={this.state.expanded
            ? 'fa fa-chevron-up'
            : 'fa fa-chevron-down'}
            aria-hidden='true' />
        </div>
      </Card>
    )
  }
}
