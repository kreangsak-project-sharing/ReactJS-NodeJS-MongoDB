const express = require("express");
const router = express.Router();

const apiReqLimiter = require("../middleware/apiReqLimiter");
const nonInvisibleTurnstileSites = require("../middleware/turnstileSites");
const userRegister = require("../controller/userRegister");

// router.use(nonInvisibleTurnstileSites);
router.use(apiReqLimiter);

router
  .get("/getcounter/:id", userRegister.getCounter)
  .post(
    "/test01",
    nonInvisibleTurnstileSites,
    userRegister.userEstablishment01
  )
  .post("/test02", nonInvisibleTurnstileSites, userRegister.userEstablishment02)
  .post("/test-03", nonInvisibleTurnstileSites, userRegister.userEstablishment03)

module.exports = router;
