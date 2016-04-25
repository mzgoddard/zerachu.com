# zerachu.com

Personal website of Z Goddard. Writing about fancy webpack and graphics work.

### build flow

Content is built and loaded dynamically both in the development and production work flows. In development a piece of content is built when needed and loaded with jsonp. In production the content is built once and evaluated to build a static version of that page including the script to the whole site and content.

To support this, both environments hit a function with the same interface to get the build asynchronously with different implementations in development and production. In development this jsonp loads a script from the server that may not exist yet, if it doesn't exist yet, it'll be built with a child compiler and returned. In production for a static builds this functions creates a webpack compiler and builds the given needed content script to be evalulated and output as well so it can be loaded at runtime.

#### psuedo dev code

##### configuration

- add a chunk to the starting entry chunks to trigger inclusion of jsonpbootstrap
- with wepback-dev-server setup method add endpoint for defer-compiler vm to request content scripts from
- endpoint adds an entry for the needed content script
- entry require.ensures content
- endpoint returns async content chunk's js name

##### client

- client uses defer-compile-loader
- loader uses web vm
- vm requests content script info
- given chunk id run __webpack__require__.e on chunk id loading it
- given chunk path, jsonp load using a callback unique to defer-compile-loader based on content entry

#### psuedo static code

##### configuration

- plugin plugins before-chunk-ids to assign chunk id
- must use record ids input and output

##### client

- client uses defer-compiler-loader
- loader uses node vm
- vm creates webpack compiler and runs the content script as an entry
- vm outputs file 
- vm outputs built aync chunk 
- vm runs __webpack__require__.e on chunk id loading it

#### psuedo production code
