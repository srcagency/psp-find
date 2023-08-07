'use strict'

const drain = require('psp-drain')

module.exports = find

function find(test) {
	let result
	return (read) =>
		drain((v) => {
			if (test(v)) {
				result = v
				return false
			} else {
				return true
			}
		})(read).then(() => result)
}
