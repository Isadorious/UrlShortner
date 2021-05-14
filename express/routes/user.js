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

router.put('/:id', async (req, res, next) => {
	passport.authenticate('jwt', async (err, user, info) => {
		if(err) console.log(err);
		if(info != undefined) {
			res.send(info.message);
			next();
		} else {
			if(user.id === req.params.id && req.body.id === req.params.id) // Check user is only trying to update themselves
				try {
					const updatedUser = await models.user.update(req.body, {where: {id: req.params.id}});
					res.status(200).json({message: 'Updated user successfully!', user: updatedUser.getUserData()});
				} catch (error) {
					res.status(500).json({message: 'Unable to update user', error: error});
				}
			else 
				res.status(400).json({message: 'Unable to update user due to bad request'});	
		}
	})(req, res, next);
});

router.get('/:id', async(req, res, next) => {
	passport.authenticate('jwt', async (err, user, info) => {
		if(err) 
			console.log(err);
		
		if(info != undefined){ 
			res.send(info.message);
			next();
		} else {
			if(user.id === req.params.id) {
				models.user.findByPk(req.params.id).then((user) => {
					if(user == null) res.json({message: 'No user found'});
					else {
						const responseData = user.getUserData();
						res.json({user: responseData});
					}
				}).catch((error) => {
					console.log(error);
					res.status(500).json({message: 'there was error', error: error});
				});
			} else {
				res.status(401).json({message: 'Unauthorized'});
			}
		}
	})(req, res, next);
});