const userEstablishment01 = require("../models/Establishment01");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  // Get all users from MongoDB
  const users = await userEstablishment01.find().lean();

  // If no users
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
};

const getData = (req, res) => {
  const { id } = req.params;
};

module.exports = { getData, getAllUsers };
