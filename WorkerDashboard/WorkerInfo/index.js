import React, { Component } from 'react'
import { css } from 'aphrodite/no-important'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import deepEqual from 'deep-equal'

import AlertButton from 'components/Dashboard/AlertButton'
import Card from 'components/Dashboard/Card'
import SearchButton from 'components/Dashboard/SearchButton'
import styles from './styles'
import { tradesFetch } from 'actions/trades'
import defaultUserIcon from 'images/user_large.png'
import { workerInfoFetch } from 'actions/worker'

// dummy data
// import dummyWorker, { dummyWorkerArray } from './fixtures'

const mapStateToProps = (state) => {
  return {
    currWorker: state.getIn(['worker', 'worker']),
    trades: state.getIn(['trades', 'trades'])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    tradesFetch: () => dispatch(tradesFetch()),
    workerInfoFetch: (clientId, projectId, groupId, userId, cb) =>
      dispatch(workerInfoFetch(clientId, projectId, groupId, userId, cb))
  }
}

export class WorkerInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      groupFilter: null,
      groupFilterList: null,
      searchResults: [],
      searchStr: '',
      workerList: null,
      workerData: null
    }
    this.filterFocus = false
    this.params = null
  }

  componentDidMount () {
    this.params = this.props.router.params
    this.searchBar = document.getElementById('worker-search-input')

    this.props.tradesFetch()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currWorker && nextProps.trades && !deepEqual(this.props.currWorker, nextProps.currWorker)) {
      const currWorker = nextProps.currWorker
      const { tradeId, tradeName } = this.parseTradeData(currWorker)
      const workerData = {
        city: currWorker.get('city'),
        email: currWorker.get('email'),
        emergencyContact: currWorker.get('emergencyContact'), // temp, see note below in JSX for emergency contact
        firstName: currWorker.get('firstname'),
        groupName: currWorker.get('userStatuses').first().getIn(['group', 'name']),
        image: currWorker.get('image'),
        lastName: currWorker.get('lastname'),
        phoneNumber: currWorker.get('phoneNumber'),
        showAddress: currWorker.get('streetAddress') && currWorker.get('city') &&
                         currWorker.get('state') && currWorker.get('zipCode'),
        state: currWorker.get('state'),
        streetAddress: currWorker.get('streetAddress'),
        tradeName: tradeName,
        tradeId: tradeId,
        zipCode: currWorker.get('zipCode')
      }
      this.setState({ workerData })
    }

    // If no search filter list has been set, use projecGroups to create one
    nextProps.projectGroups &&
      !deepEqual(nextProps.projectGroups, this.props.projectGroups) &&
      this.createGroupList(nextProps.projectGroups)

    nextProps.projectGroups &&
      nextProps.projectWorkers &&
      !deepEqual(nextProps.projectWorkers, this.props.projectWorkers) &&
      this.createWorkerList(nextProps.projectWorkers)
  }

  parseTradeData (worker) {
    const tradeId = worker.get('userStatuses').first().getIn(['group', 'tradeId'])
    const tradeName = tradeId === 34
        ? 'Project Leader'
        : this.props.trades.get('rows').filter(row => row.get('id') === tradeId).first().get('name')

    return {
      tradeId, tradeName
    }
  }

  handleFilterSelectBlur (event) {
    this.filterFocus = false
    this.handleSearchBlur(null, this.searchBar)
  }

  handleFilterSelectChange (event) {
    this.setState({ groupFilter: parseInt(event.target.selectedOptions[0].getAttribute('data-id')) })
    this.searchBar.focus()
  }

  handleFilterSelectClick (event) {
    this.filterFocus = true
  }

  handleSearchBlur (event, target) {
    // handled this manually b/c Aphrodite
    if (!this.filterFocus) {
      if (event) {
        event.target.setAttribute('style', 'color: transparent; border: 2px solid #757575; padding-left: 11px; width: 15px')
      }
      this.searchBar.setAttribute('style', 'color: transparent; border: 2px solid #757575; padding-left: 11px; width: 15px')
      this.resultsFrame.style.left = '-275px'
      this.dataFrame.style.left = '0px'
      this.groupFilterSelect.removeEventListener('mousedown', () => this.handleFilterSelectClick())
    }
  }

  handleSearchChange (event) {
    this.setState({ searchStr: event.target.value })
  }

  handleSearchFocus (event) {
    // handled this manually b/c Aphrodite
    event.target.setAttribute('style', 'color: black; border: 2px solid black; padding-left: 32px; width: 125px')
    this.resultsFrame.style.left = '-10px'
    this.dataFrame.style.left = '300px'
    this.groupFilterSelect.addEventListener('mousedown', () => this.handleFilterSelectClick())
  }

  handleSearchIconClick () {
    this.props.projectWorkers && this.searchBar.focus()
  }

  handleSearchResultClick (workerId, groupId) {
    this.props.workerInfoFetch(this.params.clientId, this.params.id, groupId, workerId, null)
  }

  handleSearchSubmit (event) {
    event.preventDefault()
  }

  createGroupList (groups) {
    let filterList = [{id: null, name: 'All Groups'}]
    groups.forEach((group, i) => {
      filterList.push({
        id: group.get('id'),
        name: group.get('name')
      })
    })
    this.setState({ groupFilterList: filterList })
  }

  createWorkerList (projectWorkers) {
    let workerList = []
    projectWorkers.forEach((worker, i) => {
      const firstName = worker.getIn(['user', 'firstname'])
      const lastName = worker.getIn(['user', 'lastname'])
      const workerId = worker.getIn(['user', 'userStatuses']).first().get('userId')
      const fullName = firstName + ' ' + lastName
      let groupIds = []
      worker.getIn(['user', 'userStatuses']).forEach(group => {
        groupIds.push(group.get('groupId'))
      })

      workerList.push({
        lastName,
        firstName,
        fullName,
        groupIds,
        workerId
      })
    })
    this.setState({ workerList })
  }

  filterWorkerList () {
    const filteredList = this.state.workerList.filter(worker => {
      if (this.state.searchStr.length === 0) {
        return true
      } else {
        if (worker.fullName.toLowerCase().includes(this.state.searchStr.toLowerCase())) {
          return true
        } else {
          return false
        }
      }
    })

    let searchResults = []
    filteredList.forEach((worker, i) => {
      const groupId = worker.groupIds.find((val) => val === this.state.groupFilter)
      if (!this.state.groupFilter || groupId !== undefined) {
        searchResults.push(
          <li
            className={css(styles.workerLi)}
            key={i}
            onClick={() => this.handleSearchResultClick(worker.workerId, groupId || worker.groupIds[0])}
            data-test='search-results-li'
          >{`${worker.firstName} ${worker.lastName}`}</li>
        )
      }
    })
    return searchResults
  }

  render () {
    const workerSearchList = this.state.workerList && this.filterWorkerList()
    let groupFilterOptions
    if (this.state.groupFilterList) {
      groupFilterOptions = this.state.groupFilterList.map((groupObj, i) => {
        return <option key={i} data-id={groupObj.id} >{groupObj.name}</option>
      })
    }

    return (
      <Card title=''>
        <div className={css(styles.noOverflowX)}>

          {/* Buttons */}
          <SearchButton
            onChangeHandler={(event) => this.handleSearchChange(event)}
            onSubmitHandler={(event) => this.handleSearchSubmit(event)}
            onFocusHandler={(event) => this.handleSearchFocus(event)}
            onBlurHandler={(event) => this.handleSearchBlur(event)}
            onIconClick={() => this.handleSearchIconClick()}
          />
          <AlertButton />
          
          {this.state.workerData
            ? (<div className={css(styles.belowButtons)} data-test='worker-data-wrapper'>
              
              {/* Search Results */}
              <div className={css(styles.resultsFrameWrapper)}>
                <div
                  id='results-frame'
                  className={css(styles.resultsFrame)}
                  ref={(resultsFrame) => { this.resultsFrame = resultsFrame }}
                >
                  <div className={css(styles.filterWrapper)}>
                    <select
                      className={css(styles.groupFilterSelect)}
                      ref={(groupFilterSelect) => { this.groupFilterSelect = groupFilterSelect }}
                      onBlur={(event) => this.handleFilterSelectBlur(event)}
                      onChange={(event) => this.handleFilterSelectChange(event)}
                    >{groupFilterOptions}
                    </select>
                  </div>
                  <ul data-test='search-results-list'>{workerSearchList}</ul>
                </div>
              </div>
              
              {/* Worker Data Frame */}
              <div
                id='data-frame'
                className={css(styles.dataFrame)}
                ref={(dataFrame) => { this.dataFrame = dataFrame }}
              >
                {/* Image */}
                <div className={css(styles.imageWrapper)}>
                  {/* TO-DO: image optimization, square cropping (see Trello) */}
                  <img
                    src={this.state.workerData.image ? this.state.workerData.image : defaultUserIcon}
                    style={{ width: 150 }}
                  />
                </div>

                {/* Name */}
                <div className={css(styles.nameAlert)}>
                  <header className={css(styles.name)} data-test='worker-name'>
                    {`${this.state.workerData.firstName} ${this.state.workerData.lastName}`}
                  </header>
                </div>

                {/* Worker Info */}
                <div className={css(styles.workerDataWrapper)}>

                  { this.state.workerData.groupName
                    ? (<div className={css(styles.dataWrapper)}>
                      <p className={css(styles.dataLabel)}>Group</p>
                      <p className={css(styles.dataText)}>{this.state.workerData.groupName}</p>
                    </div>)
                    : '' }

                  <div className={css(styles.dataWrapper)}>
                    <p className={css(styles.dataLabel)}>Trade</p>
                    <p className={css(styles.dataText)}>{this.state.workerData.tradeName}</p>
                  </div>

                  { this.state.workerData.email
                  ? (<div className={css(styles.dataWrapper)} data-test='worker-email'>
                    <p className={css(styles.dataLabel)}>Email</p>
                    <a
                      href={`mailto:${this.state.workerData.email}`}
                      className={css(styles.dataText)}>{this.state.workerData.email}
                    </a>
                  </div>)
                  : '' }

                  { this.state.workerData.phoneNumber
                  ? (<div className={css(styles.dataWrapper)}>
                    <p className={css(styles.dataLabel)}>Phone</p>
                    <p className={css(styles.dataText)}>{this.state.workerData.phoneNumber}</p>
                  </div>)
                  : '' }

                  { this.state.showAddress
                    ? (<div className={css(styles.dataWrapper)}>
                      <p className={css(styles.dataLabel)}>Address</p>
                      <p className={css(styles.dataText)}>
                        {this.state.workerData.streetAddress !== null
                        ? `${this.state.workerData.streetAddress}\n` : ''}
                      </p>
                      <p className={css(styles.dataText)}>
                        {this.state.workerData.city !== null && this.state.workerData.state !== null
                        ? `${this.state.workerData.city}, ${this.state.workerData.state}` : ''}
                        {this.state.workerData.zipCode !== null ? `${this.state.workerData.zipCode}` : ''}
                      </p>
                    </div>)
                    : '' }

                  {/* TO-DO: Emergency Contact data not currently returned from API.
                      May be because this field is only added to the worker data object
                      when emergency contact data is entered by the user??
                      I'm using fake users I created manually. */}

                  { this.state.emergencyContact
                    ? (<div className={css(styles.dataWrapper)}>
                      <p className={css(styles.dataLabel)}>Emergency Contacts</p>
                      <p className={css(styles.dataText)}>{this.state.emergencyContact}</p>
                    </div>)
                  : '' }

                </div>
              </div>
            </div>)
          : <div className={css(styles.loadingWrapper)}><p>Loading...</p></div>
        }
        </div>
      </Card>
    )
  }
}

export { WorkerInfo as Component }
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkerInfo))
