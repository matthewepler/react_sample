import { fromJS } from 'immutable'

// @MATEO - these tests will break if the data format changes. Is there a better
// way to do this?

export const currWorker = fromJS({     // pasted from API response to https://hcs-ace-api.herokuapp.com/clients/27/projects/37/groups/65/users/129
  lastname: 'Leader',
  gender: null,
  unionStatus: null,
  completedRegistration: false,
  resourceId: null,
  userStatuses: [
    {
      groupId: 65,
      projectId: 37,
      userId: 129,
      status: 'inactive',
      createdAt: '2017-06-14T14:56:16.948Z',
      updatedAt: '2017-06-14T14:56:16.948Z',
      project: {
        userId: 129,
        clientId: 27,
        resourceId: 689,
        endDate: '2020-06-10T16:00:00.000Z',
        city: 'New York',
        name: 'Sample Project 1',
        zipCode: '10006',
        updatedAt: '2017-06-14T14:56:16.882Z',
        startDate: '2017-06-14T16:00:00.000Z',
        state: 'NY',
        timeSheetGenerationDay: null,
        videoId: null,
        timeZone: 'America/New_York',
        industryId: 2,
        id: 37,
        createdAt: '2017-06-14T14:56:16.882Z',
        industry: {
          id: 2,
          name: 'Industry Two',
          createdAt: '2017-05-09T12:36:54.000Z',
          updatedAt: '2017-05-09T12:36:54.000Z'
        }
      },
      group: {
        userId: 129,
        userGroupRoles: [
          {
            endDate: '2020-06-10T16:00:00.000Z',
            roleName: 'Group Leader',
            roleId: 1,
            userId: 129,
            groupId: 65,
            startDate: '2017-06-14T16:00:00.000Z',
            createdAt: '2017-06-14T14:56:16.935Z',
            updatedAt: '2017-06-14T14:56:16.935Z'
          }
        ],
        city: null,
        name: 'Project Leaders',
        zipCode: null,
        updatedAt: '2017-06-14T14:56:16.908Z',
        shifts: null,
        state: null,
        address: null,
        id: 65,
        createdAt: '2017-06-14T14:56:16.908Z',
        tradeId: 34
      }
    }
  ],
  city: null,
  zipCode: null,
  updatedAt: '2017-06-14T14:56:16.839Z',
  deactivated: false,
  state: null,
  streetAddress: null,
  yearsOfExperience: null,
  phoneNumber: '+1 212-333-3333',
  language: 'english',
  dateOfBirth: null,
  id: 129,
  createdAt: '2017-06-14T14:56:16.839Z',
  firstname: 'Fearless',
  receiveReports: {
    dailyReports: 'true',
    weeklyReports: 'true'
  },
  email: 'test@gmail.com',
  confirmed: false
})

// @MATEO - these tests will break if the data format changes. Is there a better
// way to do this?

export const trades = fromJS({
  count: 2,
  rows: [
    {
      name: 'Boilermaker',
      id: 1,
      createdAt: '2017-05-09T12:36:54.000Z',
      updatedAt: '2017-05-09T12:36:54.000Z'
    },
    {
      name: 'Carpenter',
      id: 2,
      createdAt: '2017-05-09T12:36:54.000Z',
      updatedAt: '2017-05-09T12:36:54.000Z'
    }
  ]
})

// @MATEO - these tests will break if the data format changes. Is there a better
// way to do this?

export const projectGroups = fromJS([
  {
    user: {
      firstname: 'first1',
      lastname: 'last1',
      userStatuses: [{
        groupId: 11,
        userId: 111
      }]
    }
  },
  {
    user: {
      firstname: 'first2',
      lastname: 'last2',
      userStatuses: [{
        groupId: 22,
        userId: 222
      }]
    }
  }
])