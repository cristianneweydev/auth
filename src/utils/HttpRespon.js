module.exports = class HttpRespon {
    constructor(status, message, data) {
        if (status && message) return {
            status,
            message,
            data,
        };
    };
    status200 = (message, data) => {
        return {
            status: 200,
            message: message || "berhasil",
            data,
        };
    };
    status201 = (message, data) => {
        return {
            status: 201,
            message: message || "dibuat",
            data,
        };
    };
    status400 = (message, data) => {
        return {
            status: 400,
            message: message || "tidak memenuhi aturan request",
            data,
        };
    };
    status401 = (message, data) => {
        return {
            status: 401,
            message: message || "akses ditolak",
            data,
        };
    };
    status403 = (message, data) => {
        return {
            status: 403,
            message: message || "akses ditolak",
            data,
        };
    };
    status404 = (message, data) => {
        return {
            status: 404,
            message: message || "tidak ditemukan",
            data,
        };
    };
    status409 = (message, data) => {
        return {
            status: 409,
            message: message || "sudah ada",
            data,
        };
    };
    status500 = (message, data) => {
        return {
            status: 500,
            message: message || "kesalahan server",
            data,
        };
    };
};