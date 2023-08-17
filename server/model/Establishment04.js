// Establishment Rop
const mongoose = require("mongoose");

// Define the schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    ropmember: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    packages: {
      type: String,
      required: true,
    },
    promotioncode: {
      type: String,
    },
  },
  { timestamps: true }
);

// Before saving a new project, increment the counter
userSchema.pre("save", async function (next) {
  try {
    // Increment the counter based on the counterId
    const counter = await mongoose
      .model("Counter")
      .findByIdAndUpdate(
        { _id: "establishment04_id" },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );

    // Pad the counter value with zeros
    const paddedCounterValue = counter.sequence_value
      .toString()
      .padStart(2, "0");

    // Set the promotioncode of the new Establishment document
    this.promotioncode = `ROPD${paddedCounterValue}`;

    // Continue to save
    next();
  } catch (error) {
    console.error("Error in pre-save hook:", error);
    next(error);
  }
});

// Create the project model
const Establishment04 = mongoose.model("Establishment04", userSchema);

module.exports = Establishment04;
