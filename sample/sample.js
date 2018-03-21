'use strict';

const RequestQueue = require('../');
const nock = require('nock');

const snappyjs = 'http://www.snappyjs.com';
nock(snappyjs).get('/').times(5).delay(2000).reply(200, {success: true});

// A request to be performed, this uses [request] standard format
// see: http://www.npmjs.com/request for more information
const request = {
  method: 'GET',
  uri: snappyjs
}

// Create a new RequestQueue, running 3 requests in parallel
const rq = new RequestQueue(3);

// Listen to the resolved and rejected events when a Request is completed.
rq.on('resolved', res => {
  console.log(`Request completed (${res})`);
}).on('rejected', err => {
  console.log(err);
}).on('completed', () => {
  console.log('Queue is empty, all requests completed.');
});

// Add a single request to end of queue
rq.push(request);

// Add 3 requests to queue
rq.pushAll([request, request, request]);

// Add a single request to beginning of queue
rq.unshift(request);
