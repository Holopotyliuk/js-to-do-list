const knex = require('knex')({
    client: 'pg',
    connection: {
        user: 'andriy',
        host: 'localhost',
        database: 'tasks',
        password: '1111',
        port: 5432
    }
});
module.exports = knex;
