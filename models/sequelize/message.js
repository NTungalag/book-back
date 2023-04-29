/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('message', {
		id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},

		message: {
			type: DataTypes.STRING(300),
			allowNull: false
		},
		 
		status: {
			type: DataTypes.INTEGER(10),
			allowNull: true
		},  
	}, {
		tableName: 'message',
		timestamps: true
	});
};
