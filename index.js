const app = require('./express/app');
const sequelize = require('./sequelize');

require('dotenv').config();
const PORT = process.env.PORT;

async function assertDatabaseConnectionOk() {
	console.log('Checking database connection...');
	try {
		await sequelize.authenticate();
		console.log('Database connection OK!');
	} catch (error) {
		console.log('Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
}

async function init() {
	await assertDatabaseConnectionOk();
	console.log(`Starting link shortner on port ${PORT}...`);

	sequelize.models.user.sync();
	sequelize.models.link.sync();

	app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}.`);
	});
}

init();