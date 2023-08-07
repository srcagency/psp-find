'use strict'

const test = require('tape')
const {pull, through, values, error} = require('pull-stream')
const find = require('./')

test((t) => {
	t.plan(2)
	const stream = pull(
		values([1, 2, 3, 4]),
		find((x) => x > 2)
	)

	t.ok(stream instanceof Promise, '`stream` is a promise')
	stream.then((found) => t.equal(found, 3, 'resolved value'))
})

test('terminated on match', (t) => {
	t.plan(2)
	const processed = []
	pull(
		values([1, 2, 3]),
		through((x) => processed.push(x)),
		find((x) => x > 1)
	).then((found) => {
		t.equal(found, 2, 'resolved value')
		t.deepEqual(processed, [1, 2], 'processed values')
	})
})

test('without a match', (t) => {
	t.plan(2)
	const processed = []
	pull(
		values([1, 2, 3]),
		through((x) => processed.push(x)),
		find((x) => x > Infinity)
	).then((found) => {
		t.equal(found, undefined, 'resolved value')
		t.deepEqual(processed, [1, 2, 3], 'processed values')
	})
})

test('on an empty stream', (t) => {
	t.plan(1)
	pull(
		values([]),
		find((x) => x === {})
	).then((found) => t.equal(found, undefined, 'resolved value'))
})

test('find a stream with an error in the beginning', (t) => {
	t.plan(1)
	const testError = new Error('test')
	const stream = pull(
		error(testError),
		find((x) => x === {})
	)

	stream.catch((e) => t.equal(e, testError, 'rejection value'))
})

test('find a stream which errors', (t) => {
	t.plan(1)
	const testError = new Error('test')
	let count = 0
	pull(
		(end, cb) => {
			if (count++ < 2) {
				cb(null, count)
			} else {
				cb(testError)
			}
		},
		find((x) => x === {})
	).catch((e) => t.equal(e, testError, 'rejection value'))
})
