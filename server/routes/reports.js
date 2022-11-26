import express from 'express';

import client from '../dbClient.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import handleError from '../helpers/handleError.js';
import lodash from 'lodash';
import { parametersToQuery } from '../helpers/parametersToQuery.js';
import exportXlsx from '../helpers/exportXlsx.js';

const router = express.Router();

const { isEmpty } = lodash;

const GET_REPORT_BY_ID = `
    SELECT
        sql_code "sql_code", 
        title "title",
        id "id"
    FROM reports 
    WHERE id = :1
`;
const GET_REPORTS = 'SELECT * FROM reports';
const GET_PRIMARY_REPORTS = `
    SELECT 
        create_date "create_date",
        description "description", 
        id "id", 
        name "name", 
        parent_report_id "parent_report_id", 
        report_type "report_type", 
        sql_code "sql_code", 
        title "title"
    FROM reports
    WHERE report_type = 1 OFFSET :2 ROWS FETCH NEXT :3 ROWS ONLY
`;
const GET_PRIMARY_COUNT = 'SELECT COUNT(*) FROM reports WHERE report_type = :1';
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
const DELETE_REPORT = 'DELETE FROM reports where id = :1';

router.get('/', async (req, res) => {
    try {
        const { rows } = await client.execute(GET_REPORTS);
        res.json({ reports: rows, total: rows.length });
    } catch (e) {
        handleError(res, `${e}`);
    }
});

router.get('/report/:report_id', authenticateToken, async (req, res) => {
    const { report_id } = req.params;

    try {
        const {
            rows: [report],
        } = await client.execute(GET_REPORT_BY_ID, [report_id]);
        const { rows: parameters } = await client.execute(GET_PARAMS_BY_ID, [report_id]);
        res.json({ report, parameters });
    } catch (e) {
        handleError(res, `${e}`);
    }
});

router.get('/primary', async (req, res) => {
    const { page = 1 } = req.query;
    const rpp = 10;

    try {
        const { rows } = await client.execute(GET_PRIMARY_REPORTS, [
            `${page * rpp - rpp}`,
            `${rpp}`,
        ]);

        const counter = await client.execute(GET_PRIMARY_COUNT, ['1']);
        const count = counter.rows[0]['COUNT(*)'];

        const numberOfPages = Math.ceil(count / rpp);
        const nextPage = numberOfPages > +page ? +page + 1 : undefined;

        res.json({ reports: rows, nextPage });
    } catch (e) {
        handleError(res, `${e}`);
    }
});

router.post('/form', authenticateToken, async (req, res) => {
    const { parameters, reportId, page, xlsx = false } = req.body;

    try {
        const {
            rows: [report],
        } = await client.execute(GET_REPORT_BY_ID, [reportId]);

        const { query, values } = parametersToQuery(parameters, report.sql_code, page);

        // TODO replace report.sqlcode with name of table
        const { query: countQuery, values: countValues } = parametersToQuery(
            parameters,
            report.sql_code.replace('*', 'COUNT (*)')
        );

        const counter = await client.execute(countQuery, countValues);
        const count = counter.rows[0]['COUNT(*)'];

        const { rows } = await client.execute(query, values);

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
