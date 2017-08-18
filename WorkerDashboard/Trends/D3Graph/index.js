import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { css } from 'aphrodite/no-important'
import * as d3 from 'd3'

import { createLayer } from '../helpers'
// import styles from './styles'

const mapStateToProps = (state) => {
  return {
    dates: state.getIn(['dashboard', 'trendsDates'])
  }
}

class D3Graph extends Component {
  constructor (props) {
    super(props)
    this.state = { data: null }
    this.margins = {
      top: 15,
      right: 40,
      bottom: 15,
      left: 40
    }
    this.width = 725
    this.height = 250
    this.elemId = 'd3-svg'
    this.context = null
    this.xScale = null
    this.zoom = null
    this.xAxis = null
    this.xAxisSelector = '#x-axis'
    this.gX = null

    this.dateStrings = []
    this.graphLayers = []
    this.yAxisColors = props.colors
  }

  componentDidMount () {
    this.context = this.setContext()
    this.createGraphLayers(this.props)
  }

  componentWillUpdate (nextProps) {
    this.destroyAllLayers()
    this.createGraphLayers(nextProps)
  }

  createGraphLayers (props) {
    if (!props.dates.get('start')) return
    const startDate = props.dates.get('start')
    const endDate = props.dates.get('end')
    this.setXScale(startDate, endDate)
    // this.setZoom(startDate, endDate)

    if (!props.data) return

    const dateDiff = new Date(endDate) - new Date(startDate)
    const days = dateDiff / (1000 * 60 * 60 * 24)
    let timeType
    if (days < 2) {
      timeType = 'daily'
    } else if (days <= 7 && days >= 2) {
      timeType = 'weekly'
    } else if (days > 7 && days <= 31) {
      timeType = 'monthly'
    } else if (days > 31) {
      timeType = 'yearly'
    }

    const defaultGraphProps = {
      context: this.context,
      data: props.data,
      height: this.height,
      width: this.width,
      margins: this.margins,
      xScale: this.xScale,
      colors: this.yAxisColors,
      timeType
    }

    const rightGraphObj = createLayer(defaultGraphProps, props.right)
    const rightGraphLayer = rightGraphObj.graphCreator({ ...defaultGraphProps, side: 'right', range: rightGraphObj.graphRange })
    this.graphLayers.push(rightGraphLayer)

    const leftGraphObj = createLayer(defaultGraphProps, props.left)
    const leftGraphLayer = leftGraphObj.graphCreator({ ...defaultGraphProps, side: 'left', range: leftGraphObj.graphRange })
    this.graphLayers.push(leftGraphLayer)
  }

  setContext () {
    let context = d3.select(this.graph).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('background', '#F9F9F9')

    document.getElementById('trends-wrapper').addEventListener('mouseleave', () => {
      this.graphLayers.forEach(layer => {
        layer.toggleToolTip && layer.toggleToolTip(null, null, false)
      })
    })

    return context
  }

  setXScale (start, end) {
    const xExtent = d3.extent([start, end])
    this.xScale = d3.scaleTime()
      .domain(xExtent)
      .range([this.margins.left, this.width - this.margins.right])
      .nice(this.props.dates.num)

    this.xAxis = d3.axisBottom(this.xScale)
      .ticks(this.props.dates.num || 7)
      .tickSize((this.height - this.margins.top - this.margins.bottom) * -1)

    this.context.append('g').attr('id', 'test')

    this.context.append('div').attr('id', 'test')

    this.axisGroup = this.context.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${this.height - this.margins.bottom})`)
      .call(this.xAxis)
      .selectAll('.tick line').style('stroke', '#D7D7D7')

    d3.select('.domain').style('stroke', '#D7D7D7')
  }

  destroyAllLayers () {
    this.context.selectAll('*').remove()
    this.graphLayers.forEach((obj, i) => {
      obj.destroyGraph && obj.destroyGraph()
    })
    this.graphLayers = []
  }

  setZoom (start, end) {
    this.zoom = d3.zoom()
      .scaleExtent([1, 2])
      .on('zoom', () => {
        this.axisGroup.call(this.xAxis.scale(d3.event.transform.rescaleX(this.xScale)))
        this.graphLayers.forEach(layer => {
          layer.zoom(d3.event)
        })
      })

    this.context.call(this.zoom)
      .on('mousedown.zoom', null)

    d3.select('#reset-button')
    .style('position', 'absolute')
    .style('top', '50px')
    .style('left', `${this.width - 100}px`)
    .on('click', () => {
      console.log('reset zoom!')
      this.resetZoom()
    })
  }

  resetZoom () {
    this.context.transition()
      .duration(250)
      .call(this.zoom.transform, d3.zoomIdentity)
  }

  render () {
    return (
      <div id='trends-wrapper'>
        <div
          id='graph-div'
          ref={graph => { this.graph = graph }}
          style={{position: 'relative'}} />
        {/* <button id='reset-button'>Reset Zoom</button> */}
      </div>
    )
  }
}

export { D3Graph as Component }
export default connect(mapStateToProps, null)(D3Graph)
