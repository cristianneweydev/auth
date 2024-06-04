const express = require("express");
const verifikasiJwt = require("../middleware/verifikasiJwt");
const controller = {
    user: require("../controllers/user"),
};

const router = express.Router();

router.get("/user", verifikasiJwt, controller.user.dataAllUser);

module.exports = router;