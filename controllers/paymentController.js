import db from '../models/index.js';
import { Op } from 'sequelize';


export const payBooking = async (req,res)=>{
  try{

    const booking = await db.Booking.findByPk(req.params.id);

    if(!booking)
      return res.status(404).json({message:'Booking not found'});

    const payment = await db.Payment.create({
      bookingId: booking.id,
      amount: booking.totalPrice,
      paymentMethod: 'simulation',
      paymentStatus: 'completed',
      transactionId: 'SIM-'+Date.now(),
      paidAt: new Date()
    });

    res.json(payment);

  }catch(e){
    res.status(500).json({error:e.message});
  }
};
