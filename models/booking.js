"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       Booking.belongsTo(models.User, {
    foreignKey: 'userId'
  });

  Booking.belongsTo(models.Room, {
    foreignKey: 'roomId'
  });

  Booking.hasMany(models.Payment, {
    foreignKey: 'bookingId'
  });
    }
  }
  Booking.init(
    {
      userId: DataTypes.INTEGER,
      roomId: DataTypes.INTEGER,
      checkInDate: DataTypes.DATEONLY,
      checkOutDate: DataTypes.DATEONLY,
      totalPrice: DataTypes.DECIMAL,
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
        defaultValue: "pending",
      },

      specialRequests: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
