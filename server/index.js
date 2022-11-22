import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import client from './dbClient.js';
import userRoutes from './routes/users.js';
import reportsRoutes from './routes/reports.js';
import paramRoutes from './routes/params.js';
import paymentRoutes from './routes/payments.js';

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cors({ exposedHeaders: '*' }));

app.use('/users', userRoutes);
app.use('/reports', reportsRoutes);
app.use('/params', paramRoutes);
app.use('/payments', paymentRoutes);

// Connecting to client before server starts
(async () => {
    await client.connect();

    app.listen(PORT, () => {
        console.log(`Running on PORT ${PORT}`);
    });
})();
