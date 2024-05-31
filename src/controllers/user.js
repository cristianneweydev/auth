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
    update = async (request, response) => {
        try {
            const { login } = request.permission;
            const { aktif } = request.user;
            const { username } = request.body;
            if (login !== true || aktif !== true) response.status(403).json(this.httpRespon.status403());
            else if (!username || typeof username !== "string") response.status(400).json(this.httpRespon.status400());
            else {
                const hasilModel = await model.update({
                    user: request.user,
                    update: {
                        username,
                    },
                });
                response.status(hasilModel.status).json(hasilModel);
            };
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
};

module.exports = new User();