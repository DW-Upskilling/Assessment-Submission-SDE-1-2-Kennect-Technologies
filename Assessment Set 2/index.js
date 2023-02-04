// importing required packages
const express = require('express');
// creates express app
const app = express();

// setting port to serve the http
const port = 443;

// handles GET request on '/add' endpoint
app.get('/add', (request, response) => {
	const query = request.query;

	// defining required and optional query params
	const required = {date: new Date().toISOString()}
	const optional = {days: '0', months: '0', years: '0'}

	for(let key in required){
		if(!query[key])
			return response.status(500).json({
				code: 500,
				message: 'Incorrect Parameters',
				_ts: new Date()
			})
		required[key] = query[key]
	}

	for(let key in optional){
		if(query[key])
			optional[key] = query[key]
	}

	const date = new Date(required['date']);
	// setting day, month and year from the input provided
	date.setDate(date.getDate() + parseInt(optional['days']));
	date.setMonth(date.getMonth() + parseInt(optional['months']));
	date.setFullYear(date.getFullYear() + parseInt(optional['years']));

	// send response back to the client in the json format
	response.status(200).json({
		code: 200,
		message: date.toISOString().split('T')[0],
		_ts: new Date()
	});
});

// handles GET request on '/subtract' endpoint
app.get('/subtract', (request, response) => {
	const query = request.query;

	const required = {date: new Date().toISOString()}
	const optional = {days: '0', months: '0', years: '0'}

	for(let key in required){
		if(!query[key])
			return response.status(500).json({
				code: 500,
				message: 'Incorrect Parameters',
				_ts: new Date()
			})
		required[key] = query[key]
	}

	for(let key in optional){
		if(query[key])
			optional[key] = query[key]
	}

	const date = new Date(required['date']);

	date.setDate(date.getDate() - parseInt(optional['days']));
	date.setMonth(date.getMonth() - parseInt(optional['months']));
	date.setFullYear(date.getFullYear() - parseInt(optional['years']));

	response.status(200).json({
		code: 200,
		message: date.toISOString().split('T')[0],
		_ts: new Date()
	});
});

// Starting the http server, listens to the provided port
app.listen(port, () => {
	console.log(`App started on Port: ${port}`);

	// Enabling static files to be streamed
	app.use('/', express.static('public'));
});
