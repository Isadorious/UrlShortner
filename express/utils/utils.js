function generateUrl(urlLength) {
	const result = [];
	const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for(let i = 0; i < urlLength; i++)
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));

	return result.join('');
}

module.exports.generateUrl = generateUrl;