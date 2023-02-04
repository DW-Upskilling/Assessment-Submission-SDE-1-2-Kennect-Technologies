// importing required packages
const express = require('express');
// creates express app
const app = express();

// setting port to serve the http
const port = 80;

// Function to return the response of incorrect query params
function incorrectQueryParams(response, msg) {
	return response.status(400).json({
		status: 400,
		code: 'Bad Request',
		message: msg,
		_ts: new Date(),
	});
}

// handles GET request on '/command' endpoint
app.get('/command', async (request, response) => {
	const query = request.query;

	const required = { q: '' };

	for (let key in required) {
		if (!query[key])
			return incorrectQueryParams(
				response,
				'Error: Required parameters missing in the API request.'
			);
		required[key] = query[key];
	}

	const q = required['q'].toLowerCase().trim();
	console.log(`${new Date().toISOString()}::${q}`);
	let buffer = [];

	// Parsing the operation > add, subtract
	buffer = q.split(',');
	if (buffer.length < 2)
		return incorrectQueryParams(
			response,
			'Error: Required parameters missing in the API request.'
		);
	const operation = buffer[0].trim();
	if (operation != 'add' && operation != 'subtract')
		return incorrectQueryParams(
			response,
			'"Error: Incorrect operation specified in the command."'
		);

	// Parsing date value, expected format yyyy-MM-dd
	buffer = q.split('return');
	if (buffer.length < 2)
		return incorrectQueryParams(
			response,
			'Error: Required parameters missing in the API request.'
		);
	buffer = buffer[0].trim().split(' ');
	if (buffer.length < 2)
		return incorrectQueryParams(
			response,
			'Error: Required parameters missing in the API request.'
		);
	let date = buffer.splice(-1)[0].trim();
	if (
		date.length !== 10 ||
		date.split('-').length !== 3 ||
		date.split('-')[0].length !== 4 ||
		date.split('-')[1].length !== 2 ||
		date.split('-')[2].length !== 2
	)
		return incorrectQueryParams(
			response,
			'"Error: Incorrect Date specified in the command."'
		);
	date = new Date(date);

	// parsing the value, expected an integer
	buffer = buffer.join(' ').split(',')[1].trim().split(' ');
	if (buffer.length < 2)
		return incorrectQueryParams(
			response,
			'Error: Required parameters missing in the API request.'
		);
	let value = buffer[0];
	if (!value.match('^-?[0-9]+$'))
		return incorrectQueryParams(
			response,
			'"Error: Incorrect value specified in the command."'
		);
	value = parseInt(value);

	// parsing type, expected days, weeks, months and years only
	const type = buffer[1];
	if (type === 'days')
		date.setDate(
			operation === 'add' ? date.getDate() + value : date.getDate() - value
		);
	else if (type === 'weeks') {
		value = value * 7;
		date.setDate(
			operation === 'add' ? date.getDate() + value : date.getDate() - value
		);
	} else if (type === 'months')
		date.setMonth(
			operation === 'add' ? date.getMonth() + value : date.getMonth() - value
		);
	else if (type === 'years')
		date.setFullYear(
			operation === 'add'
				? date.getFullYear() + value
				: date.getFullYear() - value
		);
	else
		return incorrectQueryParams(
			response,
			'"Error: Incorrect type specified in the command."'
		);

	// send the response
	return response.status(200).json({
		code: 200,
		message: date.toISOString().split('T')[0],
		_ts: new Date(),
	});
});

// Starting the http server, listens to the provided port
app.listen(port, async () => {
	console.log(`App started on Port: ${port}`);

	// Enabling static files to be streamed
	app.use('/', express.static('public'));
});
