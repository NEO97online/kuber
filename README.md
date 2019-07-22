# kuber

A friendly wrapper around [kubernetes-client](https://github.com/godaddy/kubernetes-client), with the goal of providing a more expressive API for managing Kubernetes resources in Node.js.

*This library is currently being developed in parallel to internal software. It will not initially cover every use-case, but will evolve over time to fit the majority of Kubernetes needs.*

*If you have a specific feature request, feel free to create an Issue or submit a Pull Request.*


## Google Kubernetes Engine (GKE)

First, create a service account on Google Cloud with permission to access the Kubernetes resources that you want.

Then, set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable pointing to the service account `.json` file:

```sh
export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/[FILE_NAME].json"
```

