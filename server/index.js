import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import userRoutes from './routes/users.js';
import reportsRoutes from './routes/reports.js';
import paramRoutes from './routes/params.js';

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cors({ exposedHeaders: '*' }));

app.use('/users', userRoutes);
app.use('/reports', reportsRoutes);
app.use('/params', paramRoutes);

// Seeding the database
(async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Running on PORT ${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
})();
