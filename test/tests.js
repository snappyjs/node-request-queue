'use strict';

const nock = require('nock');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const PromiseQueue = require('../');

describe('node-request-queue', () => {

  const address = 'http://www.snappyjs.com';
  const addresses = [address, address, address, address, address];

  it('Should successfully perform request.', done => {
    nock(address).get('/').times(5).reply(200, 'response');

    const pq = new PromiseQueue(5); // Queue with 5 parallel requests.
    let count = 0;
    pq.on('resolved', res => {
      count++;
    }).on('completed', () => {
      expect(count).to.eql(5);
      done();
    });
    pq.pushAll(addresses);
  });

  it('Should reject requests (with delay).', done => {
    nock(address).get('/').times(5).delay(1500).reply(401, 'AuthError');
    const pq = new PromiseQueue(5);
    let count = 0;
    pq.on('rejected', err => {
      count++;
    }).on('completed', () => {
      expect(count).to.eql(5);
      done();
    })
    pq.pushAll(addresses);
  }).timeout(0);

});
