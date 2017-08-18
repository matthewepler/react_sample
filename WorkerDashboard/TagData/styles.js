import { StyleSheet } from 'aphrodite/no-important'
import { colors, fonts } from 'styles/variables'

export default StyleSheet.create({
  bottomDweller: {
    position: 'absolute',
    top: '90%'
  },
  default: {
    color: 'black'
  },
  dataGroup: {
    marginBottom: '0.5rem'
  },
  error: {
    color: colors.main
  },
  noiseLevelWrapper: {

  },
  offline: {
    color: 'black',
    opacity: '0.2'
  },
  tagDataWrapper: {
    fontFamily: fonts.main,
    marginTop: '1rem'
  }
})
