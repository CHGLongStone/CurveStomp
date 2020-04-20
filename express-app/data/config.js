const mysql = require('mysql');
const creds = require('../sensitive/credentials');


// Set database connection credentials
const config = {
    host: 'localhost',
    database: 'curvestompdev',
    connectionLimit: 10,
    user: creds.db_creds.user,
    password: creds.db_creds.password
};

// Establish a promisifying wrapper for mysql.pool
class Database {
    constructor() {
        console.log(`Using ${config.user}:${config.database}@${config.host}`);
        this.pool = mysql.createPool(config);
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, args, (err, rows) => {
                if (err) {
                    // Few error handlers, logging specific error codes in the console.
                    switch (err.code) {
                        case 'PROTOCOL_CONNECTION_LOST':
                            console.error('Database connection was closed.');
                            break;
                        case 'ER_CON_COUNT_ERROR':
                            console.error('Database has too many connections.');
                            break;
                        case 'ECONNREFUSED':
                            console.error('Database connection was refused.');
                    }
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.pool.end(err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

// Export the wrapped pool
module.exports = new Database();