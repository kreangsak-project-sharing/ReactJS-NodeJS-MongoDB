const mongoose = require("mongoose");

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
        // UserAdmin.insertInitialData();
      });
  } catch (err) {
    console.log(err);
  }
};
