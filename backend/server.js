import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import connectDB from './db/connectDB.js';
//Routes import
import authRouter from './Routes/auth.routes.js';
import restaurantRouter from './Routes/restaurant.routes.js';
import orderRouter from './Routes/order.routes.js';
import menuRouter from './Routes/menu.routes.js';
import cartRouter from './Routes/cart.routes.js';
import paymentRouter from './Routes/payment.routes.js';
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
const _dirname = path.resolve();

app.use(bodyParser.json({
    limit: '1mb',
}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use('/api/auth', authRouter);
app.use('/api/restaurant', restaurantRouter)
app.use('/api/order', orderRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/menu', menuRouter);
app.use('/api/cart', cartRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(_dirname, '/frontend/dist')));

    app.get('*', (_, res) => {
        res.sendFile(path.resolve(_dirname, 'frontend', 'dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Project running at  ${process.env.CLIENT_URL}`);
    connectDB();
    });