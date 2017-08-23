const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/node_kb', {useMongoClient: true});
let db = mongoose.connection;

// check for db errors
db.on('error', (err) => {
	console.error(err);
});

// check connection
db.once('open', () => {
	console.log('Connected to database');
})

const app = express();
const port = process.env.PORT || 3000;

// bring the article models
let article = require('./models/article');

// load view engine - PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// home route
app.get('/', (req, res) => {
	article.find({}, (err, articles) => {
		if(err){
			console.error(err);
		} else {
				res.render('index', {
				title: 'Articles',
				articles: articles
			});
		}
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