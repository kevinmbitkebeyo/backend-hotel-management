import express from 'express';
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import testRoutes from './routes/test.js';
import dotenv from 'dotenv';
dotenv.config();
import db from './models/index.js';
import cors from 'cors';

console.log(Object.keys(db.User.associations));
console.log(Object.keys(db.Booking.associations));


const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use('/api', authRoutes);

app.use('/api', testRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));