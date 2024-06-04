const HttpRespon = require("../utils/HttpRespon");
const model = require("../models/user");

class User {
    constructor() {
        this.httpRespon = new HttpRespon();
    };
    dataUser = async (request, response) => {
        try {
            const { login } = request.permission;
            const {
                username,
                email,
                dibuat,
                diperbarui,
            } = request.user;
            if (login !== true) response.status(403).json(this.httpRespon.status403());
            else {
                const dataUser = {
                    username,
                    email,
                    created: dibuat,
                    updated: diperbarui,
                };
                response.status(200).json(this.httpRespon.status200(null, dataUser));
            };
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
    updateUsername = async (request, response) => {
        try {
            const { login } = request.permission;
            const { aktif } = request.user;
            const { value } = request.query;
            if (login !== true  || aktif !== true) response.status(403).json(this.httpRespon.status403());
            else if (!value || typeof value !== "string") response.status(400).json(this.httpRespon.status400());
            else {
                const hasilModel = await model.updateUsername({
                    user: request.user,
                    newUsername: value,
                });
                response.status(hasilModel.status).json(hasilModel);
            };
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
    updateEmail = async (request, response) => {
        try {
            const { login } = request.permission;
            const { aktif } = request.user;
            const { value } = request.query;
            if (login !== true  || aktif !== true) response.status(403).json(this.httpRespon.status403());
            else if (!value || typeof value !== "string") response.status(400).json(this.httpRespon.status400());
            else {
                const hasilModel = await model.updateEmail({
                    user: request.user,
                    newEmail: value,
                });
                response.status(hasilModel.status).json(hasilModel);
            };
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
    konfirmasiUpdateEmail = async (request, response) => {
        try {
            const { login } = request.permission;
            const { aktif } = request.user;
            const { code } = request.query;
            if (login !== true  || aktif !== true) response.status(403).json(this.httpRespon.status403());
            else if (!code || typeof code !== "string") response.status(400).json(this.httpRespon.status400());
            else {
                const hasilModel = await model.konfirmasiUpdateEmail({
                    user: request.user,
                    kode: code,
                });
                response.status(hasilModel.status).json(hasilModel);
            };
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
    simpanPerubahanEmail = async (request, response) => {
        try {
            const { confirmEmailUpdate } = request.permission;
            const { aktif } = request.user;
            if (confirmEmailUpdate !== true || aktif !== true) response.status(403).json(this.httpRespon.status403());
            else {
                const hasilModel = await model.simpanPerubahanEmail(request.user);
                response.status(hasilModel.status).json(hasilModel);
            };
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
    dataAllUser = async (request, response) => {
        try {
            const { login } = request.permission;
            const { admin } = request.user;
            if (login !== true || admin !== true) response.status(403).json(this.httpRespon.status403());
            else {
                const hasilModel = await model.dataAllUser();
                response.status(hasilModel.status).json(hasilModel);
            };
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
};

module.exports = new User();