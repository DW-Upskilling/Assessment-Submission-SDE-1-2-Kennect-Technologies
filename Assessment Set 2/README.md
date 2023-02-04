# Assessment Set 2

Simple HTTP server, which replies to queries related to calender.

## Commands

### Install

Required packages are provided in **package.json**. To install execute below command

`> npm install`

### Running

The server is default to run on port **80**, this can be updated in the **index.js** script. Run the below command to start the server

`> npm start`

## Usage

### API

> wget --no-check-certificate --quiet
> --method GET
> --timeout=0
> --header ''
> 'http://localhost/command?q=subtract, 187 days from 2019-01-01 return the date'

### Browser

Open the following URL in the browser to query.

`https://localhost`
