const mongoose = require("mongoose");
const UserCounter = require("../models/UserCounter");
const UserAdmin = require("../models/UserAdmin");

const initializeCounters = async () => {
  const projectIds = [
    "establishment01_id",
    "establishment02_id",
    "establishment03_id",
  ];

  for (let _id of projectIds) {
    await UserCounter.insertInitialData(_id);
  }
};

// MongoDB connect
exports.connectDB = () => {
  try {
    mongoose
      // .connect(process.env.MONGO_DATABASE_URI_UBUNTU, {
      .connect(
        "mongodb://username:password@xx.xx.xx.xx:27017/registerDB?authSource=admin",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then(() => {
        console.log("Successfully connected to database");

        // Create Username Admin
        UserAdmin.insertInitialData();
        
        // Create Counter Defalute 0
        initializeCounters();
      });
  } catch (err) {
    console.log(err);
  }
};
