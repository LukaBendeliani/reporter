import express from 'express';

import client from '../dbClient.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import handleError from '../helpers/handleError.js';

const router = express.Router();

const CREATE_REPORT_PARAMS =
    'INSERT INTO report_params (report_id, param_type, param_code, param_name, combo_sql) VALUES (:1, :2, :3, :4, :5)';
const GET_PARAMS_BY_ID = `
SELECT 
    id "id",
    report_id "report_id",
    param_type "param_type",
    param_code "param_code",
    param_name "param_name",
    combo_sql "combo_sql"
FROM report_params 
WHERE report_id = :1
`;
const DELETE_PARAM = 'DELETE FROM report_params where id = :1';

router.get('/', authenticateToken, async (req, res) => {
    const { report_id } = req.query;

    try {
        const { rows } = await client.execute(GET_PARAMS_BY_ID, [report_id]);
        res.json(rows);
    } catch (error) {
        handleError(res, `${error}`);
    }
});

router.post('/', async (req, res) => {
    const { report_id, param_type, param_code, param_name, combo_sql } = req.body;

    console.log(req.body);
    try {
        await client.execute(CREATE_REPORT_PARAMS, [
            report_id,
            param_type,
            param_code,
            param_name,
            combo_sql || '0',
        ]);

        res.sendStatus(200);
    } catch (error) {
        handleError(res, `${error}`);
    }
});

router.delete('/', authenticateToken, async (req, res) => {
    const { id } = req.body;
    try {
        await client.execute(DELETE_PARAM, [id]);
        res.sendStatus(200);
    } catch (error) {
        handleError(res, `${error}`);
    }
});

router.get('/combosql/:sql', authenticateToken, async (req, res) => {
    const { sql } = req.params;

    try {
        const { rows } = await client.execute(sql);
        res.send(rows);
    } catch (error) {
        handleError(res, `${error}`);
    }
});

export default router;
