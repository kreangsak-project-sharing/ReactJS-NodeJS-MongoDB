const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

router.get("/:id", userController.getData);

module.exports = router;
