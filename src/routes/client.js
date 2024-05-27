const express = require("express");
const controller = {
    auth: require("../controllers/auth"),
};
const verifikasiJwt = require("../middleware/verifikasiJwt");
const { rateLimit } = require("express-rate-limit");

const router = express.Router();
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
});

router.post("/auth/register", limiter, controller.auth.register);
router.put("/auth/activation", limiter, verifikasiJwt, controller.auth.activation);
router.post("/auth/login", limiter, controller.auth.login);
router.post("/auth/recovery", limiter, controller.auth.recovery);
router.put("/auth/recovery/reset", limiter, verifikasiJwt, controller.auth.reset);
router.post("/auth/activation/resending", limiter, verifikasiJwt, controller.auth.activationResending);
router.delete("/auth/logout", limiter, verifikasiJwt, controller.auth.logout);

module.exports = router;