const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send('Hi developer. Welcome to Node-land!');
});

app.listen(port, (req, res) => {
	console.log('Listening to port ' + port);
});