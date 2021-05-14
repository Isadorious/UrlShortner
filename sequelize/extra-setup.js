function applyExtraSetup(sequelize) {
	const {user, link} = sequelize.models;

	// Link Foreign Keys
	user.hasMany(link, {
		foreignKey: {
			name: 'creatorId',
			allowNull: true,
		}
	});
	link.belongsTo(user);
}

module.exports = { applyExtraSetup };