import React, { Component } from 'react'
import { connect } from 'react-redux'
import { css } from 'aphrodite/no-important'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import deepEqual from 'deep-equal'

import Card from 'components/Dashboard/Card'
import D3Graph from './D3Graph'
import GraphSelect from './GraphSelect'
import { calcDates, endOfDay } from './helpers'
import { setTrendsDates, setTrendsGraphs } from 'actions/dashboard'
import fetch from 'utils/fetch'

import styles from './styles'
import 'react-datepicker/dist/react-datepicker.css'

const mapStateToProps = (state) => {
  return {
    dates: state.getIn(['dashboard', 'trendsDates']),
    graphs: state.getIn(['dashboard', 'graphs'])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setDates: (dates) => dispatch(setTrendsDates(dates)),
    setGraphs: (graphs) => dispatch(setTrendsGraphs(graphs))
  }
}

class Trends extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: null,
      endDate: null,
      startDate: null,
      dataFiltered: {
        left: [],
        right: []
      }
    }
    this.timeSelect = null // ref for time filter select menu
    this.yAxisColors = {
      left: '#288D00',
      right: '#6D9FFF'
    }
  }

  componentDidMount () {
    if (!this.state.startDate || !this.state.endDate) {
      this.setStartEndDates(null)
    }
    this.fetchDataBothSides(this.props)
  }

  setStartEndDates (event, explicitString) {
    const filter = event ? event.target.value : explicitString
    this.props.setDates(calcDates(filter))
  }

  setStartDate (date) {
    // if start date is greater than end date, make end date the same day ***
    const startDateTime = new Date(date._d).getTime()
    const endDateTime = new Date(this.props.dates.get('end')).getTime()
    const endDate = startDateTime > endDateTime
      ? endOfDay(date._d)
      : this.props.dates.get('end')

    this.timeSelect.value = 'custom'

    this.props.setDates({
      start: date._d,
      end: endDate,
      type: 'custom'
    })
  }

  setEndDate (date) {
    // if end date is before start date, reset to previous end date and alert
    const endDateTime = new Date(date._d).getTime()
    const startDateTime = new Date(this.props.dates.get('start')).getTime()
    if (endDateTime < startDateTime) {
      window.alert('please select an end date that is after your start date')
      return
    }
    this.timeSelect.value = 'custom'

    this.props.setDates({
      start: this.props.dates.get('start'),
      end: date._d,
      type: 'custom'
    })
  }

  componentWillReceiveProps (nextProps) {
    // NOTE: for this to work, you will need to run 'json-server' wherever the file 'db.json' is saved.
    if (!deepEqual(nextProps, this.props)) this.fetchDataBothSides(nextProps)
  }

  fetchDataBothSides (props) {
    console.log('fetchDataBothSides, type =', this.props.graphs.get('right'))
    this.fetchData('left', props.graphs.get('left'), props)
    this.fetchData('right', props.graphs.get('right'), props)
  }

  fetchData (side, type, props) {
    if (!type) return
    console.log('check type', type)
    fetch(`http://localhost:3000/${type}`).then(resp => {
      const filteredData = resp.filter(d => {
        return new Date(d.timestamp) > props.dates.get('start') &&
          new Date(d.timestamp) < props.dates.get('end')
      })
      this.setState({
        filteredData: Object.assign({}, this.state.filteredData, {[side]: filteredData})
      })
    })
  }

  handleLeftGraphSelect (event) {
    this.props.setGraphs({
      left: event.target.value,
      right: this.props.graphs.get('right')
    })
  }

  handleRightGraphSelect (event) {
    this.props.setGraphs({
      left: this.props.graphs.get('left'),
      right: event.target.value
    })
  }

  render () {
    return (
      <Card title='Trends' width='fullWidth'>

        {/* REFRESH BUTTON PLACEHOLDER */}

        {/* GRAPH */}
        {/* Create a graph component that creates a context for SVG canvas.
               Data categories and filters are passed as props here and then
               used in children to create queries and return data.  */}
        {/* Pass context to children so they can render to this parent component. */}
        <D3Graph
          data={this.state.filteredData}
          colors={this.yAxisColors}
          left={this.props.graphs.get('left')}
          right={this.props.graphs.get('right')}
        />

        {/* Select Menus */}
        <div>
          {/* Date Pickers */}
          <div id='date-picker-wrapper' className={css(styles.datePickerWrapper)}>
            <DatePicker
              id='start-date-picker'
              className={css(styles.datePicker)}
              selected={moment(this.props.dates.get('start'), 'L')}
              onChange={(date) => this.setStartDate(date)}
            />
            <span className={css(styles.span)}> {'-'} </span>
            <DatePicker
              id='end-date-picker'
              className={css(styles.datePicker)}
              selected={moment(this.props.dates.get('end'), 'L')}
              onChange={(date) => this.setEndDate(date)}
            />
          </div>

          {/* Select Menus */}
          <div className={css(styles.selectsWrapper)}>
            {/* Left Graph Select */}
            <GraphSelect
              id='left-select'
              defaultValue={this.props.graphs.get('left') || '-'}
              handler={this.handleLeftGraphSelect.bind(this)}
              color={this.yAxisColors.left}
            />
            {/* Time Filter Presets Select */}
            <div>
              <div>
                <select
                  className={css(styles.select)}
                  name='time-filter-select'
                  ref={(select) => { this.timeSelect = select }}
                  defaultValue='thismonth' // <- change back to 'thisweek'
                  onChange={(event) => this.setStartEndDates(event)}
                  style={{ borderBottom: '1px solid black' }}
                >
                  <option value='today'>Today</option>
                  <option value='yesterday'>Yesterday</option>
                  <option value='thisweek'>This Week</option>
                  <option value='lastweek'>Last Week</option>
                  <option value='thismonth'>This Month</option>
                  <option value='lastmonth'>Last Month</option>
                  <option value='thisyear'>This Year</option>
                  <option value='custom'>Custom</option>
                </select>
              </div>
            </div>
            {/* Right Graph Select */}
            <GraphSelect
              id='right-select'
              defaultValue={this.props.graphs.get('right') || '-'}
              handler={this.handleRightGraphSelect.bind(this)}
              color={this.yAxisColors.right}
            />
          </div>
        </div>

      </Card>
    )
  }
}

export { Trends as Component }
export default connect(mapStateToProps, mapDispatchToProps)(Trends)
/*

  Trends  -> data loading and filtering
    |
 D3Graph  -> axis, grid
    |
   -------------
   |            |
 graph1       graph2  -> dumb components

*/

