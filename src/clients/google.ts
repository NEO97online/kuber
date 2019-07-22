import { auth } from 'google-auth-library'
import { Client1_13, config } from 'kubernetes-client'
import Kuber from '../kuber'

export async function getGoogleClient(zone: string, clusterId: string) {
  const authClient = await auth.getClient({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  })
  const projectId = await auth.getProjectId()
  const clusterPath = `projects/${projectId}/locations/${zone}/clusters/${clusterId}`
  const { data: cluster } = await authClient.request({ url: `https://container.googleapis.com/v1beta1/${clusterPath}` })
  if (cluster.error) {
    throw new Error(cluster.error.message)
  }
  const { token } = await authClient.getAccessToken()
  const kubeConfig = {
    apiVersion: "v1",
    kind: "Config",
    preferences: {},
    "current-context": "a",
    contexts: [
      {
        name: "a",
        context: {
          cluster: "a",
          user: "a"
        }
      }
    ],
    clusters: [
      {
        name: "a",
        cluster: {
          "certificate-authority-data":
            cluster.masterAuth.clusterCaCertificate,
          server: `https://${cluster.endpoint}`
        }
      }
    ],
    users: [
      {
        name: "a",
        user: {
          "auth-provider": {
            config: {
              "access-token": token,
              "cmd-args": "config config-helper --format=json",
              "cmd-path": "/google/google-cloud-sdk/bin/gcloud",
              "token-key": "{.credential.access_token}"
            },
            name: "gcp"
          }
        }
      }
    ]
  }

  const clientApi: any = new Client1_13({
    config: config.fromKubeconfig(kubeConfig)
  })

  return clientApi.loadSpec()
}

export async function GoogleKuber(zone: string, clusterId: string, defaultNamespace = 'default') {
  const client = await getGoogleClient(zone, clusterId)
  return Kuber(client, defaultNamespace)
}
