const HttpRespon = require("../utils/HttpRespon");
const database = require("../configs/database");
const pengirimEmail = require("../configs/pengirimEmail");
const fs = require("fs");
const randomKode = require("../utils/randomKode");
const jwt = require("jsonwebtoken");

class User {
    constructor() {
        this.httpRespon = new HttpRespon();
        this.connectionHandler = {
            rollback: () => "rollback handler",
            release: () => "release handler",
        };
        this.jwtKey = process.env.JWT_KEY;
        this.urlLogin = process.env.URL_LOGIN;
    };
    updateUsername = (input) => new Promise(async (resolve, reject) => {
        let connection = this.connectionHandler;
        try {
            connection = await database.promise().getConnection();
            await connection.beginTransaction();
            const sqlUpdateAkun = "UPDATE akun SET username = ?, diperbarui = NOW() WHERE id = ?";
            const inputUpdateAkun = [input.newUsername, input.user.id];
            await connection.query(sqlUpdateAkun, inputUpdateAkun);
            connection.commit();
            resolve(this.httpRespon.status200());
        } catch(error) {
            connection.rollback();
            reject(error);
        };
        connection.release();
    });
    updateEmail = (input) => new Promise(async (resolve, reject) => {
        let connection = this.connectionHandler;
        try {
            connection = await database.promise().getConnection();
            const sqlCariAkun = "SELECT * FROM akun WHERE email = ?";
            const inputCariAkun = [input.newEmail];
            const [resultAkun] = await connection.query(sqlCariAkun, inputCariAkun);
            if (resultAkun.length) resolve(this.httpRespon.status409());
            else {
                await connection.beginTransaction();
                const kodeVerifikasi = randomKode();
                const sqlUpdateAkun = "UPDATE akun SET email_baru = ?, kode_verifikasi = ? WHERE id = ?";
                const inputUpdateAkun = [input.newEmail, kodeVerifikasi, input.user.id];
                await connection.query(sqlUpdateAkun, inputUpdateAkun);
                connection.commit();
                const sumberFileHtml = "./src/html/konfirmasiEmailBaru.html";
                const fileHtml = await fs.readFileSync(sumberFileHtml, "utf-8");
                const fileHtmlKodeEdit = fileHtml.replace("{kode}", kodeVerifikasi);
                pengirimEmail({
                    to: input.newEmail,
                    subject: "Konfirmasi email",
                    html: fileHtmlKodeEdit,
                });
                resolve(this.httpRespon.status200());
            };
        } catch(error) {
            connection.rollback();
            reject(error);
        };
        connection.release();
    });
    konfirmasiUpdateEmail = (input) => new Promise(async (resolve, reject) => {
        let connection = this.connectionHandler;
        try {
            const connection = await database.promise().getConnection();
            const sqlCariAkun = `SELECT * FROM akun WHERE id = ?`;
            const inputCariAkun = [input.user.id];
            const [resultAkun] = await connection.query(sqlCariAkun, inputCariAkun);
            if (input.kode !== resultAkun[0].kode_verifikasi) resolve(this.httpRespon.status403());
            else {
                const muatanJwt = {
                    userId: input.user.id,
                    tokenId: input.user.idToken,
                    permission: {
                        login: false,
                        confirmEmailUpdate: true,
                    },
                };
                const tokenJwt = jwt.sign(muatanJwt, this.jwtKey);
                const sumberFileHtml = "./src/html/konfirmasiEmailLama.html";
                const fileHtml = await fs.readFileSync(sumberFileHtml, "utf-8");
                const urlKonfirmasiUpdateEmail = process.env.URL_KONFIRMASI_UPDATE_EMAIL + tokenJwt;
                const fileHtmlUrlEdit = fileHtml.replace(/{url}/g, urlKonfirmasiUpdateEmail);
                pengirimEmail({
                    to: input.user.email,
                    subject: "Konfirmasi email",
                    html: fileHtmlUrlEdit,
                });
                resolve(this.httpRespon.status200());
            };
        } catch(error) {
            reject(error);
        };
        connection.release();
    });
    simpanPerubahanEmail = (input) => new Promise(async (resolve, reject) => {
        let connection = this.connectionHandler;
        try {
            connection = await database.promise().getConnection();
            await connection.beginTransaction();
            const sqlUpdateAkun = "UPDATE akun SET email = email_baru, id_token = id_token + 1, diperbarui = NOW(), email_baru = NULL, kode_verifikasi = NULL WHERE id = ?";
            const inputUpdateAkun = [input.id];
            await connection.query(sqlUpdateAkun, inputUpdateAkun);
            connection.commit();
            const sumberFileHtml = "./src/html/konfirmasiEmailBerhasil.html";
            const fileHtml = await fs.readFileSync(sumberFileHtml, "utf-8");
            const fileHtmlUrlEdit = fileHtml.replace(/{url}/g, this.urlLogin);
            const sqlCariAkun = "SELECT * FROM akun WHERE id = ?";
            const inputCariAkun =[input.id];
            const [resultAkun] = await connection.query(sqlCariAkun, inputCariAkun);
            pengirimEmail({
                to: resultAkun[0].email,
                subject: "Konfirmasi email",
                html: fileHtmlUrlEdit,
            });
            resolve(this.httpRespon.status200());
        } catch(error) {
            connection.rollback();
            reject(error);
        };
        connection.release();
    });
    dataAllUser = () => new Promise(async (resolve, reject) => {
        let connection = this.connectionHandler;
        try {
            connection = await database.promise().getConnection();
            const sqlCariSemuaAkun = "SELECT * FROM akun";
            const [resultAkun] = await connection.query(sqlCariSemuaAkun);
            const parsingResultAkun = [];
            resultAkun.map((resultAkunMap) => parsingResultAkun.push({
                id: resultAkunMap.id,
                username: resultAkunMap.username,
                email: resultAkunMap.email,
                created: resultAkunMap.dibuat,
                updated: resultAkunMap.diperbarui,
            }));
            resolve(this.httpRespon.status200(null, parsingResultAkun));
        } catch(error) {
            reject(error);
        };
        connection.release();
    });
};

module.exports = new User();