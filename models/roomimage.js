'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoomImage.belongsTo(models.RoomType, {
    foreignKey: 'roomTypeId'
  });
    }
  }
  RoomImage.init({
    roomTypeId: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    isPrimary: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'RoomImage',
  });
  return RoomImage;
};