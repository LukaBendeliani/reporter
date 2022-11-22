import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import client from '../dbClient.js';
import handleError from '../helpers/handleError.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET;

const GET_USER_BY_USERNAME = 'SELECT * FROM users WHERE user_name = $1';
const GET_USER_BY_ID = 'SELECT * FROM users WHERE id = $1';
const CREATE_USER =
    'INSERT INTO users (user_name, user_pass, category) VALUES ($1, $2, $3) RETURNING *';

router.post('/register', async (req, res) => {
    const { username, password, category } = req.body;

    if (!username || !password || !category) {
        res.status(400).send('Please fill all the fields');
        return;
    }

    try {
        const found = await client.query(GET_USER_BY_USERNAME, [username]);

        if (found.rowCount > 0) {
            res.status(400).send('Username is already taken');
            return;
        }
        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(password, salt);
        await client.query(CREATE_USER, [username, hashedPassword, category]);
        res.status(201).send();
    } catch (e) {
        handleError(res);
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const {
        rows: [user],
    } = await client.query(GET_USER_BY_USERNAME, [username]);

    if (!user) {
        res.status(400).send("User doesn't exist");
        return;
    }

    try {
        if (await bcryptjs.compare(password, user.user_pass)) {
            const accessToken = jwt.sign(user, ACCESS_TOKEN);
            res.json({ accessToken: `Bearer ${accessToken}`, user });
        } else {
            res.status(401).send('Incorrect password!');
        }
    } catch (e) {
        handleError(res);
    }
});

router.get('/user', authenticateToken, async (req, res) => {
    const { id } = req.user;
    try {
        const {
            rows: [user],
        } = await client.query(GET_USER_BY_ID, [id]);
        res.send(user);
    } catch (e) {
        res.status(500).send('Something went wrong');
    }
});

export default router;
