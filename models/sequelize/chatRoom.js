/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('chatRoom', {
		id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},

		name: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		description: {
			type: DataTypes.STRING(300),
			allowNull: true
		},
		userOne: {
			type: DataTypes.STRING(300),
			allowNull: true
		},
		userTwo: {
			type: DataTypes.INTEGER(10),
			allowNull: true
		},  
	}, {
		tableName: 'chatRoom',
		timestamps: true
	});
};
