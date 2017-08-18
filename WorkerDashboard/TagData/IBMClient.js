import IBMClient from 'ibmiotf'
import topics from './topics'

// TODO: this will need to be moved to server
// all incoming topics will be mirrored as web socket connections
// OR we leave it hear and protect the broker from anything other than read actions

const defaultConfig = {
  'org': 'ykq7wp',
  // id must be unique for every client connection
  'id': `webAdminDashboard_${Date.now()}`,
  'domain': 'internetofthings.ibmcloud.com',
  'auth-key': 'a-ykq7wp-opokhmx25k',
  'auth-token': 'MZEGIr1zROG&nn0&Wf'
}

export const initIBMClient = (config) => {
  const IBMAppClient = new IBMClient.IotfApplication(config = defaultConfig)
  return IBMAppClient
}

export const initSubscriptions = (client, id) => {
  topics.forEach(topic => {
    // client.subscribeToDeviceEvents(device_type, deviceId, topic, format)
    // '+' === all, for testing only
    client.subscribeToDeviceEvents('hcs_tag', id || '+', topic, 'json')
  })
}
