# node-request-queue

> Queue up your requests to be executed in sequence with optional delay.

[![license](https://img.shields.io/github/license/snappyjs/node-request-queue.svg)](https://www.github.com/snappyjs/node-request-queue)
[![Build Status](https://travis-ci.org/snappyjs/node-request-queue.svg?branch=master)](https://travis-ci.org/snappyjs/node-request-queue)
[![GitHub issues](https://img.shields.io/github/issues/snappyjs/node-request-queue.svg)](https://github.com/snappyjs/node-request-queue/issues)

A utility to handle requests in a queue fashion with a possibility to perform them in batch with a wait time between each new execution. Well suited for web-scraping.

## Installation

OS X, Windows & Linux

```sh
npm install node-request-queue --save
```

## Usage example

Just create a new `RequestQueue` and start adding requests to it.

```sh
const RequestQueue = require('node-request-queue');

// A request to be performed, this uses [request] standard format
// see: 'http://www.npmjs.com/request' for more information
let request = {
  method: 'GET',
  uri: 'http://www.snappyjs.com'
}

// Create a new RequestQueue, running 3 requests in parallel
let rq = new RequestQueue(3);

// Listen to the resolved and rejected events when a Request is completed.
rq.on('resolved', res => {
  // Handle successfull response
}).on('rejected', err => {
  // Handle rejected response
}).on('completed', () => {
  // Handle queue empty.
});

// Add a single request to end of queue
rq.push(request);
```

_For a complete tutorial on how node-request-queue was created have a look at my blog: http://www.snappyjs.com/2018/03/22/nodejs-requests-in-a-queue-for-web-scraping _

## API

* `#push(object/url)` - add a new request to the **end** of the queue. It's possible to use a request object alternatively an URL string for a simple `GET` request.
* `#pushAll(array)` - add an array of requests/urls to the **end** of the queue.
* `#unshift(object/url)` - add a new request to the **start** of the queue. It's possible to use a request object alternatively an URL string for a simple `GET` request.
* `#unshiftAll(array)` - add an array of requests/urls to the **start** of the queue.
* `#clear()` - clear the entire queue.
* `#size()` - get the length of the current queue. (not including currently executing items)

### Events

`node-request-queue` extends `EventEmitter` and emits the following:

* `resolved` - when a request have been resolved.
* `rejected`- when a request was rejected.
* `completed`- when the queue is empty (all requests completed)

## Development setup

```sh
git clone https://github.com/snappyjs/node-request-queue.git
npm install
npm test
npm sample
```

## Release History

* 1.0.0
  * RELEASE: Initial release.

## Meta

Tommy Dronkers
`E-mail`: tommy@snappyjs.com
`Homepage`: https://www.snappyjs.com

Distributed under the MIT license. See `LICENSE` for more information.

GitHub: (<https://github.com/snappyjs/node-request-queue>)

## Contributing

1.  Fork it (<https://github.com/snappyjs/node-promise-serial/fork>)
2.  Create your feature branch (`git checkout -b feature/fooBar`)
3.  Commit your changes (`git commit -am 'Add some fooBar'`)
4.  Push to the branch (`git push origin feature/fooBar`)
5.  Create a new Pull Request
