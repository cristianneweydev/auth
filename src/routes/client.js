const express = require("express");
const controller = {
    auth: require("../controllers/auth"),
    user: require("../controllers/user"),
};
const verifikasiJwt = require("../middleware/verifikasiJwt");
const { rateLimit } = require("express-rate-limit");

const router = express.Router();
const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
});

router.post("/auth/register", limiter, controller.auth.register);
router.put("/auth/activation", limiter, verifikasiJwt, controller.auth.activation);
router.post("/auth/login", limiter, controller.auth.login);
router.post("/auth/recovery", limiter, controller.auth.recovery);
router.put("/auth/recovery/reset", limiter, verifikasiJwt, controller.auth.reset);
router.post("/auth/activation/resending", limiter, verifikasiJwt, controller.auth.activationResending);
router.delete("/auth/logout", limiter, verifikasiJwt, controller.auth.logout);
router.post("/auth/session", verifikasiJwt, controller.auth.session);

router.get("/user/account", verifikasiJwt, controller.user.dataUser);
router.put("/user/account/username", limiter, verifikasiJwt, controller.user.updateUsername);
router.put("/user/account/email", limiter, verifikasiJwt, controller.user.updateEmail);
router.post("/user/account/email/confirmation", limiter, verifikasiJwt, controller.user.konfirmasiUpdateEmail);
router.put("/user/account/email/confirmation/save", limiter, verifikasiJwt, controller.user.simpanPerubahanEmail);

module.exports = router;