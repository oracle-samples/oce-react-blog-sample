# Blog Site - React
This repository holds the sample source code for a ReactJS implementation of a blog site powered by Oracle Content and Experience.

Please see the complete tutorial at:
[https://www.oracle.com/pls/topic/lookup?ctx=cloud&id=oce-react-blog-sample](https://www.oracle.com/pls/topic/lookup?ctx=cloud&id=oce-react-blog-sample)

A live version of this project is available at:
[https://headless.mycontentdemo.com/samples/oce-react-blog-sample](https://headless.mycontentdemo.com/samples/oce-react-blog-sample)

## Running the project 
> **NOTE:** If you need to use a proxy to reach the internet then define an oce_https_proxy environment variable:  
> export oce_https_proxy=\<scheme\>://\<proxyhost\>:\<port\>

Install dependencies by running: 
> npm install

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

## How to Contribute
This is an open source project. See [CONTRIBUTING](https://github.com/oracle/oce-react-blog-sample/blob/main/CONTRIBUTING.md) for details.

## License
Copyright (c) 2020, 2021 Oracle and/or its affiliates and released under the 
[Universal Permissive License (UPL)](https://oss.oracle.com/licenses/upl/), Version 1.0
