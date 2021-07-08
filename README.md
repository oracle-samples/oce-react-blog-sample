# About React Blog Sample

This repository holds the sample source code for a ReactJS implementation of a blog site powered by Oracle Content Management.

Please see the complete [tutorial](https://www.oracle.com/pls/topic/lookup?ctx=cloud&id=oce-react-blog-sample) and the live [demo](https://headless.mycontentdemo.com/samples/oce-react-blog-sample).

## Installation

Run the following to install the dependencies needed by this sample:

```shell
npm install
```

## Running the project

> **NOTE:** If you need to use a proxy to reach the internet then define an oce_https_proxy environment variable:  
> export oce_https_proxy=\<scheme\>://\<proxyhost\>:\<port\>

### Development

During development the dev script should be used:
> npm run dev

This script builds the client and server bundles and starts the application in a local server. Webpack will watch for code changes and recreate the client and server bundles as required.

### Production

For production the build script should be used to build the client and server bundles. Run it using:
> npm run build

When the script completes the application can be started using:
> npm run start

and then open [http://localhost:8080](http://localhost:8080)

## Images

Sample images may be downloaded from [https://www.oracle.com/middleware/technologies/content-experience-downloads.html](https://www.oracle.com/middleware/technologies/content-experience-downloads.html) under a separate license.  These images are provided for reference purposes only and may not hosted or redistributed by you.

## Contributing

This project welcomes contributions from the community. Before submitting a pull
request, please [review our contribution guide](./CONTRIBUTING.md).

## Security

Please consult the [security guide](./SECURITY.md) for our responsible security
vulnerability disclosure process.

## License

Copyright (c) 2020, 2021 Oracle and/or its affiliates.

Released under the Universal Permissive License v1.0 as shown at
<https://oss.oracle.com/licenses/upl/>.
