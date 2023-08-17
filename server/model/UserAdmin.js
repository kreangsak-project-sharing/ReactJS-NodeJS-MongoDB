const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      default: ["Employee"],
    },
  },
  { timestamps: true }
);

const insertInitialData = async () => {
  try {
    const users = await UserAdmin.findOne();

    if (!users) {
      // Hash password
      const hashedPassword = await bcrypt.hash(process.env.NODE_PASSADMIN, 10);

      const newUser = new UserAdmin({
        username: process.env.NODE_USERADMIN,
        password: hashedPassword,
        roles: "Admin",
      });
      await newUser.save();
      console.log("Initial Counter inserted");
    }
  } catch (error) {
    console.log("Error ensuring initial counter: ", error);
  }
};

// module.exports = mongoose.model("_Useradmins", userSchema);
const UserAdmin = mongoose.model("adminusers", userSchema);
module.exports = { UserAdmin, insertInitialData };
