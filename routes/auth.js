import dotenv from 'dotenv';
import express from 'express';
import passport from '../config/passport.js';
import db from '../models/index.js';
const { User } = db;
dotenv.config();

import {
  signup,
  signin,
  profile
} from '../controllers/authController.js';
import { isAdmin } from '../utils/authorize.js';
import { createRoom, getRooms, deleteRoom, getRoom, updateRoom } from '../controllers/roomController.js';
import { createBooking, getAvailableRooms, cancelBooking, getAllBookings, getMyBookings } from '../controllers/bookingController.js';
import {
  createRoomType,
  getRoomTypes
} from '../controllers/roomTypeController.js';
import { payBooking } from '../controllers/paymentController.js';

const router = express.Router();


router.post('/auth/signup', signup);
router.post('/auth/signin', signin);

router.get(
  '/auth/profile',
  passport.authenticate('jwt', { session: false }),
  profile
);


router.get('/rooms', getRooms);
router.get('/rooms/:id', getRoom)

router.post(
  '/rooms',
  passport.authenticate('jwt', { session:false }),
  isAdmin,
  createRoom
);
router.put(
  '/rooms/:id',
  passport.authenticate('jwt',{session:false}),
  isAdmin,
  updateRoom
);

router.delete(
  '/rooms/:id',
  passport.authenticate('jwt',{session:false}),
  isAdmin,
  deleteRoom
);

router.post(
  '/bookings',
  passport.authenticate('jwt',{session:false}),
  createBooking
);

router.get('/room-types', getRoomTypes);

router.post(
  '/room-types',
  passport.authenticate('jwt', { session:false }),
  isAdmin,
  createRoomType
);
router.get('/available', getAvailableRooms);
router.get(
  '/mine',
  passport.authenticate('jwt',{session:false}),
  getMyBookings
);

router.patch(
  '/bookings/:id/cancel',
  passport.authenticate('jwt',{session:false}),
  cancelBooking
);

router.get(
  '/bookings',
  passport.authenticate('jwt',{session:false}),
  isAdmin,
  getAllBookings
);

router.post(
  '/bookings/:id/pay',
  passport.authenticate('jwt',{session:false}),
  payBooking
);


export default router;
