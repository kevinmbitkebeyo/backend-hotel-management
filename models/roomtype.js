"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoomType.hasMany(models.Room, {
        foreignKey: "roomTypeId",
      });

      RoomType.hasMany(models.RoomImage, {
        foreignKey: "roomTypeId",
      });
    }
  }
  RoomType.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      basePrice: DataTypes.DECIMAL,
      capacity: DataTypes.INTEGER,
      amenities: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: "RoomType",
    }
  );
  return RoomType;
};


