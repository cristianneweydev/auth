const mysql = require("mysql2");
const mysqlPromise = require("mysql2/promise");

class Database {
    constructor() {
        this.host = process.env.MYSQL_HOST;
        this.user = process.env.MYSQL_USER;
        this.password = process.env.MYSQL_PASSWORD;
        this.database = process.env.MYSQL_DATABASE;
    };
    nonPromise = () => mysql.createPool({
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.database,
    });
    promise = () => mysqlPromise.createPool({
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.database,
    });
};

module.exports = new Database();