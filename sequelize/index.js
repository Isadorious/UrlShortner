const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');

const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USERNAME}`, `${process.env.DB_PASSWORD}`, {
	host: `${process.env.DB_HOST}`,
	dialect: `mariadb`,
	pool: {
		max: 20,
		min: 5,
		acquire: 30000,
		idle: 10000,
	}
});

const modelDefiners = [
	require('./models/user'),
	require('./models/link'),
];

for(const modelDefiner of modelDefiners) modelDefiner(sequelize);

applyExtraSetup(sequelize);

module.exports = sequelize;