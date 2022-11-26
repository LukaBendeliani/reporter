import OracleDB from 'oracledb';

const config = {
    user: 'sys',
    password: '123123',
    connectString:
        '(DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=968f5b125d8f)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=ORCLCDB)))',
    privilege: OracleDB.SYSDBA,
};

OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

const execute = async (query, values = [], options = {}) => {
    const connection = await OracleDB.getConnection(config);
    const queryResult = await connection.execute(query, values, options);
    connection.close();
    return queryResult;
};

const client = {
    execute,
};

export default client;
