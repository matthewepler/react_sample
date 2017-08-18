import {
  FALLS,
  STRUCK_BYS,
  EMERGENCY_BUTTON,
  SAFETY_BUTTON,
  EXCESSIVE_VIBRATION,
  EXCESSIVE_DECIBLES,
  BAD_BENDS,
  TRIPS,
  SLIPS,
  JUMPS,
  CONNECTED,
  INACTIVE,
  BATTERY_LEVEL,
  TEMPERATURE,
  PRESSURE,
  HUMIDITY,
  NOISE,
  VIBRATION,
  ELEVATION,
  CALORIES,
  DISTANCE,
  STEPS
} from 'constants/tagDataTypes'

import GraphDots from 'components/Dashboard/GraphDots'
import GraphLines from 'components/Dashboard/GraphLines' // <- ** START HERE: change to GraphLine

export const graphSelectList = [
  {
    name: '',
    types: [{ title: '-', graphTypes: {} }]
  },
  {
    name: 'Events',
    types: [
      {
        title: FALLS,
        graphTypes: {
          daily: (props) => new GraphDots(props),
          weekly: (props) => new GraphDots(props),
          monthly: (props) => new GraphDots(props),
          yearly: null
        },
        range: [0, 1]
      },
      {
        title: STRUCK_BYS,
        graphTypes: {}
      },
      {
        title: EMERGENCY_BUTTON,
        graphTypes: {}
      },
      {
        title: SAFETY_BUTTON,
        graphTypes: {}
      },
      {
        title: EXCESSIVE_VIBRATION,
        graphTypes: {}
      },
      {
        title: EXCESSIVE_DECIBLES,
        graphTypes: {}
      }
    ]
  },
  {
    name: 'Motions',
    types: [
      {
        title: BAD_BENDS,
        graphTypes: {
          daily: (props) => new GraphDots(props),
          weekly: (props) => new GraphDots(props),
          monthly: (props) => new GraphDots(props), // ** change to GraphBars
          yearly: (props) => new GraphDots(props)   // ** change to GraphBars
        },
        range: [1, 1023]
      },
      {
        title: TRIPS,
        graphTypes: {}
      },
      {
        title: SLIPS,
        graphTypes: {}
      },
      {
        title: JUMPS,
        graphTypes: {}
      }
    ]
  },
  {
    name: 'Telemetry',
    types: [
      {
        title: CONNECTED,
        graphTypes: {}
      },
      {
        title: INACTIVE,
        graphTypes: {}
      },
      {
        title: BATTERY_LEVEL,
        graphTypes: {}
      }
    ]
  },
  {
    name: 'Environmental',
    types: [
      {
        title: TEMPERATURE,
        graphTypes: {
          daily: (props) => new GraphLines(props),
          weekly: (props) => new GraphLines(props),
          monthly: (props) => new GraphLines(props),
          yearly: (props) => new GraphLines(props)
        },
        range: [32, 110]
      },
      {
        title: PRESSURE,
        graphTypes: {}
      },
      {
        title: HUMIDITY,
        graphTypes: {}
      },
      {
        title: NOISE,
        graphTypes: {
          daily: (props) => new GraphLines(props),
          weekly: (props) => new GraphLines(props),
          monthly: (props) => new GraphLines(props),
          yearly: (props) => new GraphLines(props)
        },
        range: [0, 1023]
      },
      {
        title: VIBRATION,
        graphTypes: {}
      },
      {
        title: ELEVATION,
        graphTypes: {}
      }
    ]
  },
  {
    name: 'Health',
    types: [
      {
        title: CALORIES,
        graphTypes: {}
      },
      {
        title: DISTANCE,
        graphTypes: {}
      },
      {
        title: STEPS,
        graphTypes: {}
      }
    ]
  }
]

export function createLayer (propsObj, type) {
  // returns single instance of a Graph class

  /* @Mateo couldn't get nested find() to work. Not sure why:
    const graphObj = graphSelectList.find(obj => {
      return obj.types.find(objType => {
        return objType.title === type
      })
    })
  */
  let graphObj
  graphSelectList.forEach(obj => {
    obj.types.forEach(objType => {
      if (objType.title === type) {
        graphObj = objType
      }
    })
  })

  const graphCreator = graphObj.graphTypes[propsObj.timeType]
  const graphRange = graphObj.range
  return { graphCreator, graphRange }
}

// All dates should be number of milliseconds since origin time
export function oneWeekFrom (dateStr) {
  const date = new Date(dateStr)
  const returnDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6, 22, 59, 59, 999)
  // console.log('oneWeekFrom', new Date(returnDate))
  return returnDate
}

export function prevSunday (dateStr) {
  const date = new Date(dateStr)
  const returnDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay(), 0, 0, 0, 0)
  // console.log('prevSundayFrom', new Date(returnDate))
  return returnDate
}

export function beginningOfDay (dateStr) {
  const date = new Date(dateStr)
  const returnDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
  // console.log('beginningOfDay', returnDate)
  return returnDate
}

export function endOfDay (dateStr) {
  const date = new Date(dateStr)
  const returnDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
  // console.log('endOfDay', returnDate)
  return returnDate
}

export function yesterday (dateStr) {
  const date = new Date(dateStr)
  date.setDate(date.getDate() - 1)
  const returnDate = beginningOfDay(date)
  // console.log('yesterday', returnDate)
  return returnDate
}

export function twoSundaysAgo (dateStr) {
  const date = new Date(dateStr)
  const newDate = date.getDate() - date.getDay() - 7
  const returnDate = new Date(date.getFullYear(), date.getMonth(), newDate, 0, 0, 0, 0)
  // console.log('twoSundaysAgo', returnDate)
  return returnDate
}

export function thisMonth (dateStr) {
  const date = new Date(dateStr)
  const returnDate = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
  // console.log('thisMonth', returnDate)
  return returnDate
}

export function endOfMonth (dateStr) {
  const date = new Date(dateStr)
  const returnDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
  // console.log('endOfMonth', returnDate)
  return returnDate
}

export function lastMonth (dateStr) {
  const date = new Date(dateStr)
  const returnDate = new Date(date.getFullYear(), date.getMonth() - 1, 1, 0, 0, 0, 0)
  // console.log('lastMonth', returnDate)
  return returnDate
}

export function thisYear (dateStr) {
  const date = new Date(dateStr)
  const returnDate = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0)
  // console.log('thisYear', returnDate)
  return returnDate
}

export function endOfYear (dateStr) {
  const date = new Date(dateStr)
  const returnDate = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999)
  // console.log('endOfYear', returnDate)
  return returnDate
}

export function calcDates (filter) {
  let start = null
  let end = null
  let num = null
  let type = null
  switch (filter) {
    case 'today':
      start = beginningOfDay(Date.now())
      end = endOfDay(start)
      num = 12
      type = 'day'
      break
    case 'yesterday':
      start = yesterday(Date.now())
      end = endOfDay(start)
      num = 12
      type = 'day'
      break
    case 'thisweek':
      start = prevSunday(Date.now())
      end = oneWeekFrom(start)
      num = 7
      type = 'week'
      break
    case 'lastweek':
      start = twoSundaysAgo(Date.now())
      end = oneWeekFrom(start)
      num = 7
      type = 'week'
      break
    case 'thismonth':
      start = thisMonth(Date.now())
      end = endOfMonth(start)
      num = 4
      type = 'month'
      break
    case 'lastmonth':
      start = lastMonth(Date.now())
      end = endOfMonth(start)
      type = 'month'
      num = 4
      break
    case 'thisyear':
      start = thisYear(Date.now())
      end = endOfYear(start)
      num = 12
      type = 'year'
      break
    default:
      // default = this week
      // start = prevSunday(Date.now())
      // end = oneWeekFrom(start)
      // num = 7
      // type = 'week'
      start = thisMonth(Date.now())
      end = endOfMonth(start)
      num = 4
      type = 'month'
  }
  return { start, end, num, type }
}

