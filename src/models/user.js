const HttpRespon = require("../utils/HttpRespon");
const database = require("../configs/database");

class User {
    constructor() {
        this.httpRespon = new HttpRespon();
        this.connectionHandler = {
            rollback: () => "rollback handler",
            release: () => "release handler",
        };
    };
    update = (input) => new Promise(async (resolve, reject) => {
        let connection = this.connectionHandler;
        try {
            connection = await database.promise().getConnection();
            await connection.beginTransaction();
            const sqlUpdateAkun = "UPDATE akun SET username = ?, diperbarui = NOW() WHERE id = ?";
            const inputUpdateAkun = [input.update.username, input.user.id];
            await connection.query(sqlUpdateAkun, inputUpdateAkun);
            connection.commit();
            resolve(this.httpRespon.status200());
        } catch(error) {
            connection.rollback();
            reject(error);
        };
        connection.release();
    });
};

module.exports = new User();