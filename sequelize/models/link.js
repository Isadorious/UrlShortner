const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const Link = sequelize.define('link', {
		shortUrl: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		targetUrl: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: false,
		}
	}, {});
	return Link;
}