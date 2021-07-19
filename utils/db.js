const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'hcmus-web.database.windows.net',
        user: 'adminsql@hcmus-web',
        password: 'web_2021',
        port: 3306,
        database: "bdt",
    },
    pool: {
        max: 100,
        min: 1,
    }
});

module.exports = knex;