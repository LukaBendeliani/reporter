import express from 'express';

import client from '../dbClient.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import handleError from '../helpers/handleError.js';

const router = express.Router();

const GET_PAYMENTS = 'SELECT * FROM payments';
const CREATE_PAYMENT =
    'INSERT INTO payments (description, date, country, create_date, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *';

const GENERATE_N_PAYMENTS = `insert into payments (
        description, date, country, amount
    )
    select
        left(md5(i::text), 10),
        '2022-11-17T10:23:36.308Z',
        md5(random()::text),
        md5(random()::integer),
    from generate_series(1, $1) s(i)`;

router.get('/', authenticateToken, async (req, res) => {
    try {
        const { rows } = await client.query(GET_PAYMENTS);

        res.json(rows);
    } catch (error) {
        handleError(error);
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { description, date, country, create_date, amount } = req.body;

    try {
        await client.query(CREATE_PAYMENT, [description, date, country, create_date, amount]);
        res.sendStatus(200);
    } catch (error) {
        handleError(error);
    }
});

export default router;
