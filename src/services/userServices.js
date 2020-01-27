import { Pool } from "pg";
require('dotenv').config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_SSL, DB_DATABASE, NODE_ENV } = process.env;
const pool = new Pool({
    host: DB_HOST,
    user: DB_USER,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT
});

module.exports = {
    dbServices: (preparedQuery, queryParams = null) => {
        return new Promise((resolve, reject) => {
            pool.query(preparedQuery, queryParams, (error, result) => {
                if (result) {
                    let reply = result.rows

                    resolve(reply);
                } else {
                    reject(error);
                }

            })
        })
    },
    availableEmail: (preparedQuery, queryParams) => {
        return new Promise((resolve, reject) => {
            pool.query(preparedQuery, queryParams, (error, result) => {
                if (result.rowCount < 1) {
                    resolve(1);
                } else {
                    reject("Oops! Email is taken");
                }

            })
        })
    },
    verifyEmail: (preparedQuery, queryParams) => {
        return new Promise((resolve, reject) => {
            pool.query(preparedQuery, queryParams, (error, result) => {
                if (result.rowCount > 0) {
                    resolve(result.rows);
                } else {
                    reject("Wrong username or password");
                }

            })
        })
    },
    clearTestDatas: (preparedQuery) => {
        return new Promise((resolve, reject) => {
            if (NODE_ENV === "test") {
                pool.query(preparedQuery, (error, result) => {
                    if (result) {
                        resolve("Test data cleared");
                    } else {
                        reject("error");
                    }

                })
            } else {
                reject("Cant truncate database");
            }
        })
    },
    checkExist: (preparedQuery, queryParams) => {
        return new Promise((resolve, reject) => {
            pool.query(preparedQuery, queryParams, (error, result) => {
                if (result) {
                    resolve(result.rowCount);
                } else {
                    reject("error");
                }

            })
        })
    }
}
