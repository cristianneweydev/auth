const HttpRespon = require("../utils/HttpRespon");
const model = require("../models/auth");

class Auth {
    constructor() {
        this.httpRespon = new HttpRespon();
    };
    register = async (request, response) => {
        try {
            const {
                username,
                email,
                password,
            } = request.body;
            if (
                !username
                || typeof username !== "string"
                || !email
                || typeof email !== "string"
                || !password
                || typeof password !== "string"
                || password.length < 8
            ) response.status(400).json(this.httpRespon.status400());
            else {
                const hasilModel = await model.register(request.body);
                response.status(hasilModel.status).json(hasilModel);
            };
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
    activation = async (request, response) => {
        try {
            const { activation } = request.permission;
            const { aktif } = request.user;
            if (activation !== true || aktif !== false) response.status(403).json(this.httpRespon.status403()); 
            else {
                const hasilModel = await model.activation(request.user);
                response.status(hasilModel.status).json(hasilModel);
            };
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
    login = async (request, response) => {
        try {
            const {
                email,
                password,
            } = request.body;
            if (
                !email
                || typeof email !== "string"
                || !password
                || typeof password !== "string"
            ) response.status(400).json(this.httpRespon.status400());
            else {
                const hasilModel = await model.login(request.body);
                response.status(hasilModel.status).json(hasilModel);
            };
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
    recovery = async (request, response) => {
        try {
            const { email } = request.query;
            if (!email || typeof email !== "string") response.status(400).json(this.httpRespon.status400());
            else {
                const hasilModel = await model.recovery(email);
                response.status(hasilModel.status).json(hasilModel);
            };
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
    reset = async (request, response)  => {
        try {
            const { recovery } = request.permission;
            const { password } = request.query;
            if (recovery !== true) response.status(403).json(this.httpRespon.status403());
            else if (!password || typeof password !== "string" || password.length < 8) response.status(400).json(this.httpRespon.status400());
            else {
                const inputModel = {
                    user: request.user,
                    newPassword: password,
                };
                const hasilModel = await model.reset(inputModel);
                response.status(hasilModel.status).json(hasilModel);
            };
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
    activationResending = async (request, response) => {
        try {
            const { aktif } = request.user;
            if (aktif === true) response.status(403).json(this.httpRespon.status403());
            else {
                const hasilModel = await model.activationResending(request.user);
                response.status(hasilModel.status).json(hasilModel);
            };
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
    logout = async (request, response) => {
        try {
            const { login } = request.permission;
            if (login !== true) response.status(403).json(this.httpRespon.status403());
            else {
                const hasilModel = await model.logout(request.user);
                response.status(hasilModel.status).json(hasilModel);
            };
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
    session = (request, response) => {
        try {
            const { login } = request.permission;
            if (login !== true) response.status(403).json(this.httpRespon.status403());
            else response.status(200).json(this.httpRespon.status200());
        } catch(error) {
            console.error(error);
            response.status(500).json(this.httpRespon.status500());
        };
    };
};

module.exports = new Auth();