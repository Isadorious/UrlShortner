const express = require('express');
const router = express.Router();
const models = require('../../sequelize').models;
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/login', async(req, res, next) => {
	passport.authenticate('login', (err, user, info) => {
		if(err) return res.json({message: 'Unable to login. Are your details correct?', error: err});
		if(info !== undefined) return res.json({message: info.message});
		req.logIn(user, {session: false}, async err => {
			if(err) return res.json({message: 'Unable to login. Are your details correct?', error: err});
			try {
				if(user === null) res.status(404).json({message: 'User not found'});
				const expiryTime = Date.now() + (60*60*2*1000);
				const token = jwt.sign({username: user.username, email: user.email}, process.env.SECRET_KEY, {expiresIn: (Math.floor(expiryTime / 1000))});
				res.status(200).send({
					auth: true,
					token: token,
					expiryTime: new Date(expiryTime),
					message: 'User signed in successfully',
					id: user.id,
				});
			}
			catch (error) {
				res.status(500).json({message: 'An error occurred', error: error});
			}
		});
	})(req, res, next);
});

router.post('/register', async(req, res, next) => {
	passport.authenticate('register', (err, user, info) => {
		if (err) console.log(err);
		if(info != undefined) res.send(info.message);
		else 
			req.logIn(user, async err => {
				if(err) return res.json({message: 'Unable to register.', error: err});
				try {
					const user = await models.user.findOne({where: {username: req.body.username}});
					user.email = req.body.email;
					await user.save();
					res.status(200).send({message: 'user created'});
				} catch (error) {
					const user = await models.user.findOne({where: {username: req.body.username}});
					await user.destroy();
					res.status(500).json({message: 'An error occurred', error: error});
				}
			});
	})(req, res, next);
});