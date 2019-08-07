import { Kuber, getGoogleClient } from 'node-kuber'

const client = getGoogleClient('my-project', 'us-east1', 'my-cluster')
const kuber = Kuber(client)
