const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const passport = require('passport');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

require('./auth/auth');
app.use(passport.initialize());

const environment = process.env.NODE_ENV;

if(environment !== 'production') app.use(logger('dev'));

app.get('ping', (req, res) => {
	res.send('pong');
});

// API routing
const userRoutes = require('./routes/user');
const linkRoutes = require('./routes/link');

app.use('/api/v1/users', userRoutes);
app.use('/l/', linkRoutes);

module.exports = app;