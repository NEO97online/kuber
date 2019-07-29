import { exec, ChildProcess } from 'child_process'

export default function Kuber(client: any, defaultNamespace = 'default') {
  return {
    client,
    defaultNamespace,

    createNamespace(body: any) {
      return client.api.v1.namespaces.post({ body })
    },

    createSecret(body: any, namespace = defaultNamespace) {
      return client.api.v1.namespaces(namespace).secrets.post({ body })
    },

    createDeployment(body: any, namespace = defaultNamespace) {
      const [apiName, apiVersion] = body.apiVersion.split("/")
      return client.apis[apiName][apiVersion]
        .namespaces(namespace)
        .deployments.post({ body })
    },

    createService(body: any, namespace = defaultNamespace) {
      return client.api.v1.namespaces(namespace).services.post({ body })
    },

    createIngress(body: any, namespace = defaultNamespace) {
      return client.apis.extensions.v1beta1
        .namespaces(namespace)
        .ingresses.post({ body })
    },

    createPersistentVolume(body: any) {
      return client.api.v1.persistentvolumes.post({ body })
    },

    createPersistentVolumeClaim(body: any, namespace = defaultNamespace) {
      return client.api.v1
        .namespaces(namespace)
        .persistentvolumeclaims.post({ body })
    },

    getPods(namespace = defaultNamespace) {
      return client.api.v1.namespaces(namespace).pods.get()
    },

    async getPod(namespace = defaultNamespace, containerName: string) {
      const { body: { items: pods } } = await client.api.v1.namespaces(namespace).pods.get()
      const wordpressPod = pods.find((pod: any) => !!pod.spec.containers.find((container: any) => container.name === containerName))
      if (!wordpressPod) {
        throw new Error(`Failed to find a wordpress pod for site: ${namespace}`)
      }
      return wordpressPod
    },

    kubectl(cmd: string): ChildProcess {
      return exec(`kubectl ${cmd}`)
    },

    copy(from: string, to: string, options?: { namespace: string, container: string }): ChildProcess {
      let cmd = `kubectl cp ${from} ${to}`
      if (options && options.namespace) {
        cmd += ` --namespace ${options.namespace}`
      }
      if (options && options.container) {
        cmd += ` --container ${options.container}`
      }
      return exec(cmd)
    },

    exec(cmd: string): ChildProcess {
      return exec(`kubectl exec ${cmd}`)
    }
  }
}
