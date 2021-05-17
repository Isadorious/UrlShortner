const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const models = require('../../sequelize').models;
const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;

passport.use('register', new localStrategy({
	usernameField: 'username',
	passworldField: 'password',
	session: false,
}, async (username, password, done) => {
	try {
		const user = await models.user.findOne({where: {username: username}});
		if (user !== null) return done(null, false, {message: 'Username already taken'}); 
		const newUser = await models.user.create({username, password});
		return done(null, newUser);
	} catch (error) {
		done(error, false, {message: 'Unable to create account!'});
	}
}));

passport.use('login', new localStrategy({
	usernameField: 'username',
	passwordField: 'password',
	session: false,
}, async (username, password, done) => {
	try {
		const user = await models.user.findOne({where: {username: username}});
		if(user === null) return done(null, false, {message: 'Unable to find username'});
		const isValid = await user.isValidPassword(password);
		if(!isValid) return done(null, false, {message: 'Invalid password'});
		return done(null, user);
	} catch (error) {
		return done(error, false, {message: 'Unable to find username'});
	}
}));

passport.use('jwt', new jwtStrategy ({
	jwtFromRequest: extractJwt.fromAuthHeaderWithScheme('JWT'),
	secretOrKey: `${process.env.SECRET_KEY}`,
}, async (payload, done) => {
	try {
		// Payload has username, email, iat (issued at) & exp (expiry)
		if(Math.floor(Date.now() / 1000) > (payload.exp / 2)) 
			done(null, false, {message: 'Authentication Failed - Token Expired'});
		else {
			const user = await models.user.findOne({where: {username: payload.username, email: payload.email}});
			if(user === null) done(null, false, {message: 'Authentication failed'});
			else done(null, user);
		}
	} catch (error) {
		done(error, false, {message: 'Authentication failed'});
	}
}));