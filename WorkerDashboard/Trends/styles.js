import { StyleSheet } from 'aphrodite/no-important'
import { colors, fonts } from 'styles/variables'

export default StyleSheet.create({
  datePickerWrapper: {
    fontFamily: fonts.main,
    margin: 'auto',
    marginTop: '15px',
    textAlign: 'center'
  },
  datePicker: {
    borderBottom: `1px solid ${colors.border}`,
    margin: 'auto',
    textAlign: 'center',
    width: '84px'
  },
  select: {
    '-webkit-appearance': 'none',
    background: 'transparent',
    border: 'none',
    borderRadius: '0px',
    padding: '2px'
  },
  selectsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px'
  },
  span: {
    marginLeft: '7px',
    marginRight: '7px'
  }
})
