require("dotenv").config();
const express = require("express");
const router = {
    client: require("./src/routes/client"),
    admin: require("./src/routes/admin"),
};
const database = require("./src/configs/database");
const cors = require("cors");

const app = express();
const serverPort = process.env.SERVER_PORT || 3000;
const permissionCors = cors({
    origin: process.env.URL_CORS,
});

app.use("/api", permissionCors, express.json(), router.client, router.admin);

app.listen(serverPort, (error) => {
    if (error) console.error(error);
    else console.log(`SERVER BERJALAN DI PORT ${serverPort}`);
});

database.nonPromise().getConnection((error, connection) => {
    if (error) console.error(error);
    else {
        console.log("DATABASE AKTIF");
        connection.release();
    };
});