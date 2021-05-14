const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
	const User = sequelize.define('user', {
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				isEmail: true,
			}
		},
	}, {});

	const setSaltAndPassword = async function(user) {
		if(user.changed('password')) {
			const saltingRounds = parseInt(process.env.SALTING_ROUNDS);
			user.password = await bcrypt.hash(user.password, saltingRounds);
		}
	};

	User.prototype.isValidPassword = async function(password) {
		return await bcrypt.compare(password, this.password);
	};

	User.beforeCreate(setSaltAndPassword);
	User.beforeUpdate(setSaltAndPassword);

	return User;
}