import { exec, ChildProcess } from 'child_process'

export default function Kuber(client: any, defaultNamespace = 'default') {
  return {
    client,
    defaultNamespace,

    createNamespace(body: any) {
      return client.api.v1.namespaces.post({ body })
    },

    deleteNamespace(name: string) {
      return client.api.v1.namespaces(name).delete()
    },

    createSecret(body: any, namespace = defaultNamespace) {
      return client.api.v1.namespaces(namespace).secrets.post({ body })
    },

    deleteSecret(name: string, namespace = defaultNamespace) {
      return client.api.v1.namespaces(namespace).secrets(name).delete()
    },

    createDeployment(body: any, namespace = defaultNamespace) {
      const [apiName, apiVersion] = body.apiVersion.split("/")
      return client.apis[apiName][apiVersion]
        .namespaces(namespace)
        .deployments
        .post({ body })
    },

    deleteDeployment(name: string, namespace = defaultNamespace) {
      return client.apis.apps.v1beta1.namespaces(namespace).deployments(name).delete()
    },

    createService(body: any, namespace = defaultNamespace) {
      return client.api.v1.namespaces(namespace).services.post({ body })
    },

    deleteService(name: string, namespace = defaultNamespace) {
      return client.api.v1.namespaces(namespace).services(name).delete()
    },

    createIngress(body: any, namespace = defaultNamespace) {
      return client.apis.extensions.v1beta1
        .namespaces(namespace)
        .ingresses.post({ body })
    },

    deleteIngress(name: string, namespace = defaultNamespace) {
      return client.apis.extensions.v1beta1.namespaces(namespace).ingresses(name).delete()
    },

    createPersistentVolume(body: any) {
      return client.api.v1.persistentvolumes.post({ body })
    },

    deletePersistentVolume(name: string) {
      return client.api.v1.persistentvolumes(name).delete()
    },

    createPersistentVolumeClaim(body: any, namespace = defaultNamespace) {
      return client.api.v1
        .namespaces(namespace)
        .persistentvolumeclaims.post({ body })
    },

    deletePersistentVolumeClaim(name: string, namespace = defaultNamespace) {
      return client.api.v1.namespaces(namespace).persistentvolumeclaims(name).delete()
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

    exec(namespace = defaultNamespace, pod: string, container: string, command: string[]) {
      return client.api.v1.namespaces(namespace).pods(pod).exec.post({
        qs: {
          container,
          command,
          stdout: true,
          stderr: true
        }
      })
    }
  }
}
