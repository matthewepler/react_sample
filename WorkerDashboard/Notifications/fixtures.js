import randomDate from 'utils/randomDate'
import sample from 'lodash/sample'

const types = [
  'Fall',
  'Struck-By',
  'Emergency Button Press',
  'Safety Notification Button Press'
]

const readUnread = [
  true,
  false
]

const randomFixtures = (number) => {
  let fixtures = []
  for (let i = 0; i < number; i++) {
    fixtures.push({
      dateTime: randomDate(new Date(2017, 5, 1, 8, 0), new Date()),
      type: sample(types),
      read: sample(readUnread)
    })
  }
  return fixtures
}

export default randomFixtures
