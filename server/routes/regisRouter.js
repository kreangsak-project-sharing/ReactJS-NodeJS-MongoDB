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
    "/thaismile",
    nonInvisibleTurnstileSites,
    userRegister.userEstablishment01
  )
  .post("/nokair", nonInvisibleTurnstileSites, userRegister.userEstablishment03)
  .post("/rop", nonInvisibleTurnstileSites, userRegister.userEstablishment04)
  .post("/bmw", nonInvisibleTurnstileSites, userRegister.userEstablishment05)
  .post(
    "/bitkub-ba",
    nonInvisibleTurnstileSites,
    userRegister.userEstablishment06
  )
  .post(
    "/bitkub-bbt",
    nonInvisibleTurnstileSites,
    userRegister.userEstablishment07
  )
  .post(
    "/bitkub-bo",
    nonInvisibleTurnstileSites,
    userRegister.userEstablishment08
  )
  .post("/tg", nonInvisibleTurnstileSites, userRegister.userEstablishment09)
  .post(
    "/silver-voyage-club",
    nonInvisibleTurnstileSites,
    userRegister.userEstablishment10
  );

module.exports = router;
