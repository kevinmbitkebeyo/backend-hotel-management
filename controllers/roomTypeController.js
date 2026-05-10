import db from '../models/index.js';

export const createRoomType = async (req, res) => {
  try {
    const roomType = await db.RoomType.create(req.body);
    res.status(201).json(roomType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRoomTypes = async (req, res) => {
  try {
    const roomTypes = await db.RoomType.findAll();
    res.json(roomTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
