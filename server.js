const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// load view engine - PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// home route
app.get('/', (req, res) => {

	// hardcoded articles list
	let articles = [{
		id: 1,
		title: 'Article 1',
		author: 'Irfan',
		body: 'This is article #1',
		created_date: Date.now()
	},{
		id: 2,
		title: 'Article 2',
		author: 'John',
		body: 'This is article #2',
		created_date: Date.now()
	},{
		id: 3,
		title: 'Article 3',
		author: 'Jane',
		body: 'This is article #3',
		created_date: Date.now()
	}];

	res.render('index', {
		title: 'Articles',
		articles: articles
	});
});

// add route
app.get('/articles/add', (req, res) => {
	res.render('add_article', {
		title: 'Add new article'
	});
})

app.listen(port, (req, res) => {
	console.log('Listening to port ' + port);
});