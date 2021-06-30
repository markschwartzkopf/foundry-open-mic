'use strict';

const nodecgApiContext = require('./nodecg-api-context');

module.exports = function (nodecg) {
	nodecgApiContext.set(nodecg);
	require('./obs');
};
