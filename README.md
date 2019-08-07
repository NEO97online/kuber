# 🐙 kuber

A friendly wrapper around [kubernetes-client](https://github.com/godaddy/kubernetes-client), with the goal of providing a more expressive API for managing Kubernetes resources in Node.js.

>⚠️ This library is in its initial phase of development. It is not yet production-ready.


**Features**:

🐙 Simple API for managing Kubernetes resources - just simply `createDeployment()`, `getPods()`, etc.

🔌 Plug-n-play connectors to various cloud providers (GKE)

🔬 Config introspection: reads each config to figure out the exact endpoint to send it to

🛠 Utilities for reading yaml files and strings

## Google Kubernetes Engine (GKE)

First, create a service account on Google Cloud with permission to access the Kubernetes resources that you want.

Then, set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable pointing to the service account `.json` file:

```sh
export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/[FILE_NAME].json"
```

## Usage

```js
import { GoogleKuber, yaml } from 'node-kuber'

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
