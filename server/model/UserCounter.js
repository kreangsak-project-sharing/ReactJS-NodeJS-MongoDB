const mongoose = require("mongoose");

// Define the counter schema
const counterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number,
});

// for first time to inset defalt value for "promotionCodeCounter"
const insertInitialData = async (_id) => {
  try {
    const counter = await Counter.findOne({ _id });

    if (!counter) {
      const sequence_value = _id === "establishment02_id" ? 24 : 0;

      const newCounter = new Counter({
        _id,
        sequence_value,
      });

      await newCounter.save();
      console.log(`Initial Counter inserted for ${_id}`);
    }
  } catch (error) {
    console.log("Error ensuring initial counter: ", error);
  }
};

// module.exports = mongoose.model("Counter", counterSchema);
const Counter = mongoose.model("Counter", counterSchema);
module.exports = { Counter, insertInitialData };
