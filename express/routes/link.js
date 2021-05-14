const express = require('express');
const router = express.Router();
const models = require('../../sequelize/index').models;
const passport = require('passport');
const { generateUrl } = require('../utils/utils');

// Create link
// Get link to use
// Get all links for a certain user

router.get('/:shortUrl', async(req, res, next) => {
	// Redirect user to correct place
	// Look up short url, then redirect to long url
	// If short url doesn't exist take them to homepage
	const link = await models.link.findOne({where: {shortUrl: req.params.shortUrl}});
	if(link !== undefined) {
		res.redirect(link.targetUrl);
	} else {
		res.redirect('/');
	}
});

router.post('/', async (req, res, next) => {
	passport.authenticate('jwt', async (err, user, info) => {
		if(err) 
			console.log(err);	
		if(info != undefined){ 
			console.log('info defined');
			res.send(info.message);
			next();
		} else {
				const link = await models.link.create({
					shortUrl: generateUrl(6),
					targetUrl: req.body.targetUrl,
					creatorId: req.body.creatorId,
				});
				res.json({message: 'Link created', link: link});
		}
	})(req, res, next);
});

router.get('/', async (req, res, next) => {
	passport.authenticate('jwt', async (err, user, info) => {
		if(err) 
			console.log(err);
		if(info != undefined){ 
			console.log('info defined');
			res.send(info.message);
			next();
		} else {
			// Only get the links a user is the creator for
			const links = await models.links.findAll({where: {creatorId: user.id}});
			if(links == null) res.status(404).json({message: 'Links not found'});
			else res.json({links: links});
		}	
	})(req, res, next);
});

module.exports = router;