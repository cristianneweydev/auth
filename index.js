require("dotenv").config();
const express = require("express");
const router = {
    client: require("./src/routes/client"),
};
const database = require("./src/configs/database");

const app = express();
const serverPort = process.env.SERVER_PORT || 3000;

app.use("/api", express.json(), router.client);

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