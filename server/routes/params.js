import express from 'express';

import client from '../dbClient.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import handleError from '../helpers/handleError.js';

const router = express.Router();

const CREATE_REPORT_PARAMS =
    'INSERT INTO report_params (report_id, param_type, param_code, param_name, combo_sql) VALUES ($1, $2, $3, $4, $5) RETURNING *';
const GET_PARAMS_BY_ID = 'SELECT * FROM report_params where report_id = $1';
const UPDATE_PARAM =
    'SELECT * FROM report_params SET (paramType, paramCode, paramName, comboSql) VALUES ($1, $2, $3, $4) where id = $5';
const DELETE_PARAM = 'DELETE FROM report_params where id = $1';

router.get('/', authenticateToken, async (req, res) => {
    const { report_id } = req.query;

    try {
        const { rows } = await client.query(GET_PARAMS_BY_ID, [report_id]);
        res.json(rows);
    } catch (error) {
        handleError(res);
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { report_id, param_type, param_code, param_name, combo_sql } = req.body;
    console.log(req.body);
    try {
        const { rows } = await client.query(CREATE_REPORT_PARAMS, [
            report_id,
            param_type,
            param_code,
            param_name,
            combo_sql,
        ]);
        res.json(rows);
    } catch (error) {
        handleError(res);
    }
});

// router.put('/', authenticateToken, async (req, res) => {
//     const { id, paramType, paramCode, paramName, comboSql } = req.body;
//     try {
//         await client.query(UPDATE_PARAM, [paramType, paramCode, paramName, comboSql, id]);
//         res.send(200);
//     } catch (error) {
//         handleError(error);
//     }
// });

router.delete('/', authenticateToken, async (req, res) => {
    const { id } = req.body;
    try {
        await client.query(DELETE_PARAM, [id]);
        res.send(200);
    } catch (error) {
        handleError(res);
    }
});

router.get('/combosql/:sql', authenticateToken, async (req, res) => {
    const { sql } = req.params;

    try {
        const { rows } = await client.query(sql);
        res.send(rows);
    } catch (error) {
        handleError(res, `Incorrect query in combo_sql: ${sql}`);
    }
});

export default router;
