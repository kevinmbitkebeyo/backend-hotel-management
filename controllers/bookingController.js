import db from '../models/index.js';
import { Op } from 'sequelize';

export const createBooking = async (req, res) => {
  try {

    const { roomId, checkInDate, checkOutDate } = req.body;

    
    const conflict = await db.Booking.findOne({
      where: {
        roomId,
        status: 'confirmed',
        [Op.or]: [
          {
            checkInDate: {
              [Op.between]: [checkInDate, checkOutDate]
            }
          },
          {
            checkOutDate: {
              [Op.between]: [checkInDate, checkOutDate]
            }
          }
        ]
      }
    });

    if (conflict)
      return res.status(400).json({ message: 'Room not available' });

    
    const room = await db.Room.findByPk(roomId, {
      include: db.RoomType
    });

    const days =
      (new Date(checkOutDate) - new Date(checkInDate))
      / (1000 * 60 * 60 * 24);

    const totalPrice = days * room.RoomType.basePrice;

    
    const booking = await db.Booking.create({
      userId: req.user.id,
      roomId,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: 'confirmed'
    });

    res.json(booking);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


export const getAvailableRooms = async (req, res) => {
  try {
    const { checkInDate, checkOutDate } = req.query;

    const bookedRooms = await db.Booking.findAll({
      where: {
        status: 'confirmed',
        [Op.or]: [
          {
            checkInDate: {
              [Op.between]: [checkInDate, checkOutDate]
            }
          },
          {
            checkOutDate: {
              [Op.between]: [checkInDate, checkOutDate]
            }
          }
        ]
      },
      attributes: ['roomId']
    });

    const ids = bookedRooms.map(b => b.roomId);

    const rooms = await db.Room.findAll({
      where: {
        id: { [Op.notIn]: ids }
      },
      include: db.RoomType
    });

    res.json(rooms);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {

    const bookings = await db.Booking.findAll({
      where: { userId: req.user.id },
      include: [
        db.Room,
        db.Payment
      ]
    });

    res.json(bookings);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const cancelBooking = async (req,res)=>{
  try{

    const booking = await db.Booking.findByPk(req.params.id);

    if(!booking)
      return res.status(404).json({message:'Not found'});

    if(booking.userId !== req.user.id)
      return res.status(403).json({message:'Forbidden'});

    booking.status = 'cancelled';
    await booking.save();

    res.json({message:'Cancelled'});

  }catch(e){
    res.status(500).json({error:e.message});
  }
};

export const getAllBookings = async (req,res)=>{
  try{

    const bookings = await db.Booking.findAll({
      include:[
        db.User,
        db.Room,
        db.Payment
      ]
    });

    res.json(bookings);

  }catch(e){
    res.status(500).json({error:e.message});
  }
};
