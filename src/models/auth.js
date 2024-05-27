const database = require("../configs/database");
const HttpRespon = require("../utils/HttpRespon");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const pengirimEmail = require("../configs/pengirimEmail");

class Auth {
    constructor() {
        this.connectionHandler = {
            rollback: () => "rollback handler",
            release: () => "release handler",
        };
        this.httpRespon = new HttpRespon();
        this.jwtKey = process.env.JWT_KEY;
        this.urlLogin = process.env.URL_LOGIN;
    };
    register = (input) => new Promise(async (resolve, reject) => {
        let connection = this.connectionHandler;
        try {
            connection = await database.promise().getConnection();
            const sqlCariAkun = "SELECT * FROM akun WHERE email = ?";
            const inputCariAkun = [input.email];
            const [resultAkun] = await connection.query(sqlCariAkun, inputCariAkun);
            if (resultAkun.length) resolve(this.httpRespon.status409());
            else {
                await connection.beginTransaction();
                const sqlInsertAkun = "INSERT INTO akun (username, email, password) VALUES (?, ?, SHA1(?))";
                const inputInsertAkun = [input.username, input.email, input.password];
                const [resultInsertAkun] = await connection.query(sqlInsertAkun, inputInsertAkun);
                connection.commit();
                const muatanJwt = {
                    userId: resultInsertAkun.insertId,
                    tokenId: 1,
                    permission: {
                        login: false,
                        activation: true,
                    },
                };
                const tokenJwt = jwt.sign(muatanJwt, this.jwtKey);
                const sumberFileHtml = "./src/html/aktivasiAkun.html";
                const fileHtml = await fs.readFileSync(sumberFileHtml, "utf-8");
                const urlAktivasiAkun = process.env.URL_AKTIVASI_AKUN + tokenJwt;
                const fileHtmlUrlEdit = fileHtml.replace(/{url}/g, urlAktivasiAkun);
                pengirimEmail({
                    to: input.email,
                    subject: "Aktivasi Akun",
                    html: fileHtmlUrlEdit,
                });
                resolve(this.httpRespon.status201());
            };
        } catch(error) {
            connection.rollback();
            reject(error);
        };
        connection.release();
    });
    activation = (input) => new Promise(async (resolve, reject) => {
        let connection = this.connectionHandler;
        try {
            connection = await database.promise().getConnection();
            await connection.beginTransaction();
            const sqlUpdateAkun = "UPDATE akun SET id_token = id_token + 1, aktif = 1 WHERE id = ?";
            const inputUpdateAkun = [input.id];
            await connection.query(sqlUpdateAkun, inputUpdateAkun);
            connection.commit();
            const sumberFileHtml = "./src/html/aktivasiAkunBerhasil.html"
            const fileHtml = await fs.readFileSync(sumberFileHtml, "utf-8");
            const fileHtmlUrlEdit = fileHtml.replace(/{url}/g, this.urlLogin);
            pengirimEmail({
                to: input.email,
                subject: "Aktivasi Akun",
                html: fileHtmlUrlEdit,
            });
            resolve(this.httpRespon.status200());
        } catch(error) {
            connection.rollback();
            reject(error);
        };
        connection.release();
    });
    login = (input) => new Promise(async (resolve, reject) => {
        let connection = this.connectionHandler;
        try {
            connection = await database.promise().getConnection();
            const sqlCariAkun = "SELECT * FROM akun WHERE email = ? AND password = SHA1(?)";
            const inputCariAkun = [input.email, input.password];
            const [resultAkun] = await connection.query(sqlCariAkun, inputCariAkun);
            if (!resultAkun.length) resolve(this.httpRespon.status404());
            else {
                const muatanJwt = {
                    userId: resultAkun[0].id,
                    tokenId: resultAkun[0].id_token,
                    permission: {
                        login: true,
                    },
                };
                const tokenJwt = jwt.sign(muatanJwt, this.jwtKey);
                const dataRespon = this.httpRespon.status200(null, {
                    token: tokenJwt,
                    admin: resultAkun[0].admin ? true : false,
                });
                resolve(dataRespon);
            };
        } catch(error) {
            reject(error);
        };
        connection.release();
    });
    recovery = (inputEmail) => new Promise(async (resolve, reject) => {
        let connection = this.connectionHandler;
        try {
            connection = await database.promise().getConnection();
            const sqlCariAkun = "SELECT * FROM akun WHERE email = ?";
            const inputCariAkun = [inputEmail];
            const [resultAkun] = await connection.query(sqlCariAkun, inputCariAkun);
            if (resultAkun.length) {
                const muatanJwt = {
                    userId: resultAkun[0].id,
                    tokenId: resultAkun[0].id_token,
                    permission: {
                        login: false,
                        recovery: true,
                    },
                };
                const tokenJwt = jwt.sign(muatanJwt, this.jwtKey);
                const sumberFileHtml = "./src/html/resetPassword.html";
                const fileHtml = await fs.readFileSync(sumberFileHtml, "utf-8");
                const urlAktivasiAkun = process.env.URL_RESET_PASSWORD + tokenJwt;
                const fileHtmlUrlEdit = fileHtml.replace(/{url}/g, urlAktivasiAkun);
                pengirimEmail({
                    to: inputEmail,
                    subject: "Reset Password",
                    html: fileHtmlUrlEdit,
                });
            };
            resolve(this.httpRespon.status200());
        } catch(error) {
            reject(error);
        };
        connection.release();
    });
    reset = (input) => new Promise(async (resolve, reject) => {
        let connection = this.connectionHandler;
        try {
            connection = await database.promise().getConnection();
            await connection.beginTransaction();
            const sqlUpdateAkun = "UPDATE akun SET password = SHA1(?), id_token = id_token + 1 WHERE id = ?";
            const inputUpdateAkun = [input.newPassword, input.user.id];
            await connection.query(sqlUpdateAkun, inputUpdateAkun);
            connection.commit();
            const sumberFileHtml = "./src/html/resetPasswordBerhasil.html";
            const fileHtml = await fs.readFileSync(sumberFileHtml, "utf-8");
            const fileHtmlUrlEdit = fileHtml.replace(/{url}/g, this.urlLogin);
            pengirimEmail({
                to: input.user.email,
                subject: "Reset Password",
                html: fileHtmlUrlEdit,
            });
            resolve(this.httpRespon.status200());
        } catch(error) {
            connection.rollback();
            reject(error);
        };
        connection.release();
    });
    activationResending = (input) => new Promise(async (resolve, reject) => {
        try {
            const muatanJwt = {
                userId: input.id,
                tokenId: input.idToken,
                permission: {
                    login: false,
                    activation: true,
                },
            };
            const tokenJwt = jwt.sign(muatanJwt, this.jwtKey);
            const sumberFileHtml = "./src/html/aktivasiAkun.html";
            const fileHtml = await fs.readFileSync(sumberFileHtml, "utf-8");
            const urlAktivasiAkun = process.env.URL_AKTIVASI_AKUN + tokenJwt;
            const fileHtmlUrlEdit = fileHtml.replace(/{url}/g, urlAktivasiAkun);
            pengirimEmail({
                to: input.email,
                subject: "Aktivasi Akun",
                html: fileHtmlUrlEdit,
            });
            resolve(this.httpRespon.status200());
        } catch(error) {
            reject(error);
        };
    });
    logout = (input) => new Promise(async (resolve, reject) => {
        let connection = this.connectionHandler;
        try {
            connection = await database.promise().getConnection();
            await connection.beginTransaction();
            const sqlUpdateAkun = "UPDATE akun SET id_token = id_token + 1 WHERE id = ?";
            const inputUpdateAkun = [input.id];
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

module.exports = new Auth();