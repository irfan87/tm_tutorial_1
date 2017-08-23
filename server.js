const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// load view engine - PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// home route
app.get('/', (req, res) => {
	res.render('index');
});

app.listen(port, (req, res) => {
	console.log('Listening to port ' + port);
});