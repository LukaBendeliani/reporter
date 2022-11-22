import express from 'express';

import client from '../dbClient.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import handleError from '../helpers/handleError.js';
import lodash from 'lodash';
import { parametersToQuery } from '../helpers/parametersToQuery.js';
import exportXlsx from '../helpers/exportXlsx.js';

const router = express.Router();

const { isEmpty } = lodash;

const GET_REPORT_BY_ID = 'SELECT * FROM reports where id = $1';
const GET_REPORTS = 'SELECT * FROM reports';
const GET_PRIMARY_REPORTS = 'SELECT * FROM reports WHERE report_type = $1 LIMIT $2 OFFSET $3';
const GET_PRIMARY_COUNT = 'SELECT COUNT(*) FROM reports WHERE report_type = $1';
const CREATE_REPORT =
    'INSERT INTO reports (name, title, description, sql_code, report_type, parent_report_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
const GET_PARAMS_BY_ID = 'SELECT * FROM report_params where report_id = $1';
const DELETE_REPORT = 'DELETE FROM reports where id = $1';

const GENERATE_N = `insert into reports (
    name, title, description, sql_code, report_type, parent_report_id
)
select
    left(md5(i::text), 10),
    md5(random()::text),
    md5(random()::text),
    'select * from payments',
    1,
    1
from generate_series(1, $1) s(i)`;

const GENERATE_N_PAYMENTS = `insert into payments (
    description, date, country, amount
)
select
    left(md5(i::text), 10),
    '2022-11-17T10:23:36.308Z',
    md5(random()::text),
    random()::integer
from generate_series(1, $1) s(i)`;

router.get('/', authenticateToken, async (req, res) => {
    try {
        const { rows } = await client.query(GET_REPORTS);
        res.json({ reports: rows, total: rows.length });
    } catch (e) {
        handleError(e);
    }
});

router.get('/report/:report_id', authenticateToken, async (req, res) => {
    const { report_id } = req.params;

    try {
        const {
            rows: [report],
        } = await client.query(GET_REPORT_BY_ID, [report_id]);
        const { rows } = await client.query(GET_PARAMS_BY_ID, [report_id]);
        res.json({ report, parameters: rows });
    } catch (e) {
        handleError(res);
    }
});

router.get('/primary', authenticateToken, async (req, res) => {
    const { page } = req.query;
    const rpp = 10;

    try {
        const { rows } = await client.query(GET_PRIMARY_REPORTS, [1, rpp, page * rpp - rpp]);
        const {
            rows: [{ count }],
        } = await client.query(GET_PRIMARY_COUNT, [1]);

        const numberOfPages = Math.ceil(count / rpp);
        const nextPage = numberOfPages > +page ? +page + 1 : undefined;

        res.json({ reports: rows, nextPage });
    } catch (e) {
        handleError(res);
    }
});

router.get('/generate', async (req, res) => {
    try {
        await client.query(GENERATE_N_PAYMENTS, [1000000]);
        res.send(200);
    } catch (error) {
        handleError(res);
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { name, title, description, sql_code, reportType, parent_report_id } = req.body;

    try {
        await client.query(CREATE_REPORT, [
            name,
            title,
            description,
            sql_code,
            reportType,
            parent_report_id,
        ]);
        res.sendStatus(200);
    } catch (error) {
        handleError(error);
    }
});

router.post('/form', authenticateToken, async (req, res) => {
    const { parameters, reportId, page, xlsx = false } = req.body;

    try {
        const {
            rows: [report],
        } = await client.query(GET_REPORT_BY_ID, [reportId]);

        const { query, values } = parametersToQuery(parameters, report.sql_code, page);

        // TODO replace report.sqlcode with name of table
        const { query: countQuery, values: countValues } = parametersToQuery(
            parameters,
            report.sql_code.replace('*', 'COUNT (*)')
        );

        const {
            rows: [{ count }],
        } = await client.query(countQuery, countValues);

        const { rows } = await client.query(query, values);

        if (isEmpty(rows)) {
            res.json({ data: [], columns: [] });
        } else {
            const columns = Object.keys(rows[0]).map((col) => ({ dataIndex: col, title: col }));
            if (xlsx) {
                const workbook = exportXlsx(columns, rows);
                workbook.write(`${report.title}_REPORT.xlsx`, res);
            } else {
                res.json({ data: rows, columns: columns, total: +count });
            }
        }
    } catch (error) {
        handleError(res, `${error}`);
        console.error(error);
    }
});

router.delete('/', authenticateToken, async (req, res) => {
    const { id } = req.body;

    try {
        console.log(id);
        await client.query(DELETE_REPORT, [id]);
        res.sendStatus(200);
    } catch (error) {
        handleError(res, `${error}`);
    }
});

export default router;
