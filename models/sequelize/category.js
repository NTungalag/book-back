/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('category', {
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
		exchangeCount: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: true
		},
		
	}, {
		tableName: 'category',
		timestamps: true
	});
};
