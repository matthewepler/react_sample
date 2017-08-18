import { StyleSheet } from 'aphrodite/no-important'
import { colors, fonts } from 'styles/variables'

export default StyleSheet.create({
  dataRead: {
    fontWeight: 'default'
  },
  dataUnread: {
    fontWeight: 'bold'
  },
  dataWrapper: {
    fontFamily: fonts.main,
    fontSize: '0.9rem',
    marginLeft: '1rem',
    width: '100%'
  },
  dateTime: {
    paddingTop: '0.4rem'
  },
  expandButton: {
    borderRadius: '3px',
    color: colors.greyFont,
    margin: 'auto',
    paddingTop: '1rem',
    textAlign: 'center'
  },
  icon: {
    paddingLeft: '0.25rem',
    width: '40px'
  },
  notificationWrapper: {
    alignItems: 'center',
    display: 'flex',
    height: '55px',
    marginBottom: '2rem'
  },
  scrollOff: {
    height: '500px',
    overflowY: 'scroll',
    transition: 'all 0.3s ease-in-out'
  },
  scrollOn: {
    height: '250px',
    overflowY: 'scroll',
    transition: 'all 0.3s ease-in-out'
  },
  type: {
    borderBottom: '1px solid black',
    paddingBottom: '0.4rem'
  }
})
