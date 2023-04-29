/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(245),
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      about: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.name} - ${this.email} (${this.role})`;
        },
      },
    },
    {
      tableName: "user",
      timestamps: true
    }
  );
};
