const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
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
let Article = require('./models/article');

// load view engine - PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// home route
app.get('/', (req, res) => {
	Article.find({}, (err, articles) => {
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
});

// add submit POST route
app.post('/articles/add', (req, res) => {
	let article = new Article();
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	article.save((err) => {
		if(err){
			console.error(err);
			return;
		} else {
			res.redirect('/');
		}
	})
});

app.listen(port, (req, res) => {
	console.log('Listening to port ' + port);
});