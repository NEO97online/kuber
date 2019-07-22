# 🐙 kuber

A friendly wrapper around [kubernetes-client](https://github.com/godaddy/kubernetes-client), with the goal of providing a more expressive API for managing Kubernetes resources in Node.js.

>⚠️ This library is in its initial phase of development. It is not yet production-ready.

*This library is currently being developed in parallel to internal software. It will not initially cover every use-case, but will evolve over time to fit the majority of Kubernetes needs.*

*If you have a specific feature request, feel free to create an Issue or submit a Pull Request.*


## Google Kubernetes Engine (GKE)

First, create a service account on Google Cloud with permission to access the Kubernetes resources that you want.

Then, set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable pointing to the service account `.json` file:

```sh
export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/[FILE_NAME].json"
```

## Usage

```js
import { GoogleKuber, yaml } from 'kuber'

// create a kuber client connected to GKE
const kuber = await GoogleKuber('us-east1', 'my-cluster')

// create deployment from raw yaml string
await kuber.createDeployment(yaml`
  apiVersion: v1
  kind: Pod
  metadata:
    name: busybox1
    labels:
      app: busybox1
  spec:
    containers:
    - image: busybox
      command:
        - sleep
        - "3600"
      imagePullPolicy: IfNotPresent
      name: busybox
    restartPolicy: Always
`)

// create service from config file
await kuber.createService(await config(
  [__dirname, 'service.yaml'],
  { 
    __IP_ADDRESS__: process.env.SVC_IP_ADDRESS,
    __HOSTNAME__: process.env.SVC_HOSTNAME
  }
))
```
