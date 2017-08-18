import { StyleSheet } from 'aphrodite/no-important'
import { colors, fonts, sizes } from 'styles/variables'

export default StyleSheet.create({
  gutterRight: {
    marginRight: sizes.cardGutter
  },
  leftColumn: {
    flex: 1,
    maxWidth: '25%'
  },
  mainWrapper: {
    display: 'flex'
  },
  rightColumn: {
    display: 'block',
    flex: 3,
    maxWidth: '75%'
  },
  sectionWrapper: {
    display: 'flex'
  },
  sectionTitle: {
    color: colors.font,
    fontFamily: fonts.main,
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  }
})
