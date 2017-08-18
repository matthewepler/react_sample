import { StyleSheet } from 'aphrodite/no-important'
import { colors, fonts, transitions } from 'styles/variables'

export default StyleSheet.create({
  belowButtons: {
    // display: 'inline-block',
    marginTop: '3rem'
  },
  dataText: {
    fontSize: '1rem',
    fontWeight: 'default'
  },
  dataLabel: {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '0.25rem'
  },
  dataFrame: {
    position: 'relative',
    transition: transitions.base
  },
  dataWrapper: {
    fontFamily: fonts.main,
    marginBottom: '1rem',
    position: 'relative'
  },
  filterWrapper: {
    padding: '0.75rem'
  },
  groupFilterSelect: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #d9d9d9',
    borderLeft: '0px',
    borderRight: '0px',
    borderTop: '0px',
    color: 'black',
    fontWeight: 'bold',
    marginBottom: '0px',
    padding: '5px 0',
    width: '100%'
  },
  groupLi: {
    fontWeight: '300'
  },
  imageWrapper: {
    textAlign: 'center'
  },
  loadingWrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '4.5rem'
  },
  name: {
    fontFamily: fonts.main,
    fontSize: '1.3rem'
  },
  nameAlert: {
    marginTop: '1.3rem',
    textAlign: 'center'
  },
  noOverflowX: {
    overflowX: 'hidden'
  },
  resultsFrame: {
    left: '-275px',
    position: 'absolute',
    transition: transitions.base,
    width: '100%'
  },
  resultsFrameWrapper: {
    position: 'relative'
  },
  show: {
    opacity: '1'
  },
  workerDataWrapper: {
    marginTop: '1.5rem'
  },
  workerLi: {
    borderBottom: `1px solid ${colors.lightgrey}`,
    fontFamily: fonts.main,
    fontSize: '1.1rem',
    padding: '0.75rem'
  },
  workerSearchIcon: {
    fontSize: '1.2rem',
    position: 'relative',
    top: '95px'
  }
})
