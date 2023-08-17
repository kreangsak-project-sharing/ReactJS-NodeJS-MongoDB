const express = require("express");
const router = express.Router();

const apiReqLimiter = require("../middleware/apiReqLimiter");
const nonInvisibleTurnstileSites = require("../middleware/turnstileSites");
const authController = require("../controller/authContriller");

// router.use(nonInvisibleTurnstileSites);
// router.use(apiReqLimiter);

router
  .post(
    "/login",
    apiReqLimiter,
    nonInvisibleTurnstileSites,
    authController.login
  )
  .get("/refresh", authController.refresh)
  .post("/logout", authController.logout);

module.exports = router;
