const HttpRespon = require("../utils/HttpRespon");
const jwt = require("jsonwebtoken");
const database = require("../configs/database");

const httpRespon = new HttpRespon();

module.exports = (request, response, next) => {
    try {
        const tokenJwt = request.headers.authorization;
        if (!tokenJwt || typeof tokenJwt !== "string") response.status(401).json(httpRespon.status401());
        else {
            const jwtKey = process.env.JWT_KEY;
            jwt.verify(tokenJwt, jwtKey, async (error, decode) => {
                let connection = {
                    release: () => "release handler",
                };
                try {
                    if (error) throw error;
                    connection = await database.promise().getConnection();
                    const sqlCariAkun = "SELECT * FROM akun WHERE id = ?";
                    const inputCariAkun = [decode.userId];
                    const [resultAkun] = await connection.query(sqlCariAkun, inputCariAkun);
                    if (!resultAkun.length) response.status(403).json(httpRespon.status403());
                    else if (decode.tokenId !== resultAkun[0].id_token) response.status(403).json(httpRespon.status403());
                    else {
                        request.user = {
                            id: resultAkun[0].id,
                            username: resultAkun[0].username,
                            email: resultAkun[0].email,
                            idToken: resultAkun[0].id_token,
                            admin: resultAkun[0].admin ? true : false,
                            aktif: resultAkun[0].aktif ? true : false,
                            dibuat: resultAkun[0].dibuat,
                            diperbarui: resultAkun[0].diperbarui,
                        };
                        request.permission =  decode.permission;
                        next();
                    };
                } catch(error) {
                    console.error(error);
                    response.status(500).json(httpRespon.status500());
                };
                connection.release();
            });
        };
    } catch(error) {
        console.error(error);
        response.status(500).json(httpRespon.status500());
    };
};