const express = require('express');
const router = express.Router();

// bring the article models
let Article = require('../models/article');

// bring the user models
let User = require('../models/user');

// access control
ensureAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()) {
		return next();
	} else {
		req.flash('danger', 'Login is required');
		res.redirect('/users/login');
	}
}

// add route
router.get('/add', (req, res) => {
	res.render('add_article', {
		title: 'Add new article'
	});
});

// add submit POST route
router.post('/add', ensureAuthenticated, (req, res) => {
	req.checkBody('title', 'Title is required').notEmpty();
	// req.checkBody('author', 'Author is required').notEmpty();
	req.checkBody('body', 'Article\'s body is required').notEmpty();

	// get the error if the field are empty
	let errors = req.validationErrors();

	if(errors) {
		res.render('add_article', {
			title: 'Add new article',
			errors: errors
		});
	} else {
		let article = new Article();
		article.title = req.body.title;
		article.author = req.user._id;
		article.body = req.body.body;

		article.save((err) => {
			if(err){
				console.log(err);
				return;
			} else {
				req.flash("success", "Article added");
				res.redirect('/');
			}
		});
	}
});

// get single article via id
router.get('/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		User.findById(article.author, (err, user) => {
			if(err) {
				throw err;
			}
			else {
				res.render('article', {
					article: article,
					author: user.name
				});
			}
		});
	});
});

// load edit article form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if(article.author != req.user._id){
			req.flash('danger', 'You must be the admin for this page.');
			res.redirect('/articles/' + req.params.id);
		}
		res.render('edit_article', {
			title: 'Edit Current Article',
			article: article
		});
	});
});

// update current article
router.post('/edit/:id', (req, res) => {
	let article = {};

	article.title = req.body.title;
	article.author = req.user._id;
	article.body = req.body.body;

	let article_query = {_id: req.params.id};

	Article.update(article_query, article, (err) => {
		if(err){
			console.log(err);
			return
		} else {
			req.flash("success", "Article updated");
			res.redirect('/articles/' + req.params.id);
		}
	});
});

// delete unwanted article
router.delete('/:id', (req, res) => {
	if(!req.user._id){
		res.sendStatus(500);
	}

	let article_query = {_id: req.params.id};

	Article.findById(req.params.id, (err, article) => {
		if(article.author != req.user._id){
			res.sendStatus(500);
		} else {
			Article.remove(article_query, (err) => {
				if(err){
					console.log(err)
				}

				res.sendStatus(200);
			});
		}
	});
});

module.exports = router;