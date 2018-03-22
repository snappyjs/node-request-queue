'use strict';

const request = require('request-promise');
const EventEmitter = require('events');
const assert = require('assert');

const EVENTS = {
	RESOLVED: 'resolved',
	REJECTED: 'rejected',
	COMPLETED: 'completed'
};

/**
 * Utility to perform multiple requests [see: http://www.npmjs.com/request]

 * Configurable with number of parallel requests to be performed at once
 * and a waitTime between start-up of each new request.
 *
 * emits events:
 *  'resolved' : When request was resolved.
 *  'rejected' : When request was rejected.
 *  'completed' : When the queue is empty.
 *
 * @extends EventEmitter
 */
class RequestQueue extends EventEmitter {
	/**
	 * Create a new RequestQueue with a fixed number of parallel requests
	 * and waitTime between each request.
	 * @param {Number} [parallel=1] Number of parallel requests to be run at once.
	 * @param {Number} [waitTime=0] Time in ms before staring a new request when one is completed.
	 */
	constructor(parallel = 1, waitTime = 0) {
		super();

		assert.ok(Number.isInteger(parallel) && parallel >= 1, 'Parallel needs to be a integer >= 1.');
		assert.ok(Number.isInteger(waitTime) && waitTime >= 0, 'waitTime needs to be a integer >= 0.');

		this._requests = [];
		this._parallel = parallel;
		this._waitTime = waitTime;

		this._running = 0; // The number of currently running requests.
		this._completed = false; // To tell if we need to emit 'completed' event.
	}

	/**
	 * PRIVATE
	 * Handle the next request.
	 */
	_next() {
		while (this._running < this._parallel && this._requests.length !== 0) {
			this._completed = false; // We have a new request about to start so we are not completed.
			this._running++;
			request(this._requests.shift())
				.then(res => {
					this._running--;
					this.emit(EVENTS.RESOLVED, res);
					this._wait().then(() => this._next());
				})
				.catch(err => {
					this._running--;
					this.emit(EVENTS.REJECTED, err);
					this._wait().then(() => this._next());
				});
		}
		this._emitIfCompleted();
	}

	/**
	 * PRIVATE
	 * Helper to emit when we have emptied the queue.
	 */
	_emitIfCompleted() {
		if (this._running === 0 && this._requests.length === 0 && !this._completed) {
			this._completed = true;
			this.emit(EVENTS.COMPLETED);
		}
	}

	/**
	 * PRIVATE
	 * Wait for specific time then resolve promise.
	 */
	_wait() {
		if (this._waitTime === 0) return Promise.resolve();
		return new Promise(resolve => {
			setTimeout(resolve, this._waitTime);
		});
	}

	/**
	 * Add a new request to the queue of requests to be executed.
	 * @param  {Object} req Can be any request object or string to perform the request to.
	 * @return {this}
	 */
	push(req) {
		this._requests.push(req);
		this._next();
		return this;
	}

	/**
	 * Add multiple requests to the queue.
	 * @param  {Array} reqs Array of requests to be executed.
	 * @return {this}
	 */
	pushAll(reqs) {
		this._requests = this._requests.concat(reqs);
		this._next();
		return this;
	}

	/**
	 * Get the current size of the queue.
	 * @return {Number} length of the queue.
	 */
	size() {
		return this._requests.length;
	}

	/**
	 * Add a new item to the front of the queue.
	 * @return {this}
	 */
	unshift(req) {
		this._requests.unshift(req);
		this._next();
		return this;
	}

	/**
	 * Add a new items to the front of the queue.
	 * @return {this}
	 */
	unshiftAll(reqs) {
		this._requests = reqs.concat(this._requests);
		this._next();
		return this;
	}

	/**
	 * Clears the queue (all ongoing requests will still be completed though)
	 * @return {this}
	 */
	clear() {
		this._requests = [];
	}
}

module.exports = RequestQueue;
