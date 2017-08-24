const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useMongoClient: true});
let db = mongoose.connection;

// check for db errors
db.on('error', (err) => {
	console.log(err);
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

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// express messages middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// passport config
require('./config/passport')(passport);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());	

// user global variable
app.get('*', (req, res, next) => {
	res.locals.user = req.user || null;
	next();
});

// home route
app.get('/', (req, res) => {
	Article.find({}, (err, articles) => {
		if(err){
			console.log(err);
		} else {
				res.render('index', {
				title: 'Articles',
				articles: articles
			});
		}
	});
});

// Router files
let articles = require('./routes/articles');
let users = require('./routes/users');

app.use('/articles', articles);
app.use('/users', users);

app.listen(port, (req, res) => {
	console.log('Listening to port ' + port);
});