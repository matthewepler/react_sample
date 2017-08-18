import React, { Component } from 'react'
import { css } from 'aphrodite/no-important'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import WorkerInfo from './WorkerInfo'
import TagData from './TagData'
import Trends from './Trends'
import Notifications from './Notifications'
import { projectWorkersFetch } from 'actions/projects'
import { workerInfoFetch } from 'actions/worker'

import Card from 'components/Dashboard/Card'
import styles from './styles'

const mapStateToProps = (state) => {
  return {
    projectWorkers: state.getIn(['dashboard', 'projectWorkers']),
    currWorker: state.getIn(['worker', 'worker'])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    workerInfoFetch: (clientId, projectId, groupId, userId, cb) =>
      dispatch(workerInfoFetch(clientId, projectId, groupId, userId, cb)),
    projectWorkersFetch: (projectId, clientId, groups, qs, cb) =>
      dispatch(projectWorkersFetch(projectId, clientId, groups, qs, cb))
  }
}

export class WorkerDashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchString: ''
    }
    this.params = this.props.router.params
  }

  componentWillReceiveProps (nextProps) {
    // when Fetch is completed by Dashboard, it will send a List of groups...
    if (!this.props.projectWorkers && nextProps.projectGroups) {
      this.props.projectWorkersFetch(this.params.id, this.params.clientId, nextProps.projectGroups, '', null)
    }

    // if no currWorker is set (via actions in either Dashboard)
    if (!this.props.currWorker && this.props.projectWorkers) {
      // fetch currWorker data of first worker in first group
      const firstGroupId = nextProps.projectGroups.first().get('id')
      const firstUserId = nextProps.projectGroups.first().getIn(['user', 'userStatuses']).first().get('userId')
      this.props.workerInfoFetch(this.params.clientId, this.params.id, firstGroupId, firstUserId)
    }
  }

  onSearchChange (event) {
    this.setState({ searchString: event.target.value })
  }

  onSearchFormSubmit (event) {
    event.preventDefault()
    this.setState({ searchString: '' })
  }

  render () {
    return (
      <div className={css(styles.mainWrapper)}>

        {/* Left Column (Worker Section) */}
        <section className={css(styles.gutterRight, styles.leftColumn)}>
          <WorkerInfo
            currWorker={this.props.currWorker}
            projectGroups={this.props.projectGroups}
            projectWorkers={this.props.projectWorkers}
          />
        </section>

        {/* Right Column (Main Section) */}
        <section className={css(styles.gutterRight, styles.rightColumn)}>

          {/* Top Row */}
          <div className={css(styles.sectionWrapper)}>
            {/* NOTE: 3D scene is taking a while to load and blocks app. Better in production? 
                Possible Solutions:
                  - http://learningthreejs.com/blog/2011/09/16/performance-caching-material/
                  - https://www.html5rocks.com/en/tutorials/appcache/beginner/
            */}
            <TagData />
            <Notifications />
          </div>

          {/* 2nd Row */}
          <div className={css(styles.sectionWrapper)}>
            <Trends />
          </div>

          {/* 3rd Row */}
          <div className={css(styles.sectionWrapper)}>
            <Card title='Totals' width='min'>
              <p>placeholder</p>
            </Card>
          </div>
        </section>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkerDashboard))
