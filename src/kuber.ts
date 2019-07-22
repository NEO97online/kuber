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
    }
  }
}
