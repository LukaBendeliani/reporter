import Pg from 'pg';

const config = {
    password: 'root',
    user: 'root',
    host: 'postgres',
};

const client = new Pg.Client(config);

export default client;
