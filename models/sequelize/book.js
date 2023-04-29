/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('book', {
		id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},

		title: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		author: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		description: {
			type: DataTypes.STRING(300),
			allowNull: true
		},
		location: {
			type: DataTypes.STRING(300),
			allowNull: true
		},
		latitude: {
			type: DataTypes.DECIMAL(9,6) ,
			allowNull: true
		}, longitude: {
			type: DataTypes.DECIMAL(9,6) ,
			allowNull: true
		},
		image: {
			type: DataTypes.STRING(),
			allowNull: true
		},
	}, {
		tableName: 'book',
		timestamps: true
	});
};
