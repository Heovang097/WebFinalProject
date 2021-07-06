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
        min: 0,
        max: 50
    }
});

module.exports = knex;