import { Kuber, getGoogleClient } from 'kuber'

const client = getGoogleClient('my-project', 'us-east1', 'my-cluster')
const kuber = Kuber(client)
