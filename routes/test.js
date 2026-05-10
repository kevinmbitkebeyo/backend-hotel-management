import express from 'express';
import db from '../models/index.js';

const router = express.Router();

router.get('/association-test', async (req, res) => {
  try {
    const booking = await db.Booking.findOne({
      include: [db.User, db.Room]
    });

    res.json(booking || { message: 'No booking found' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
