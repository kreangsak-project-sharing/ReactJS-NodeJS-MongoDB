// Connect MongoDB
require("./config/dbConn").connectDB();

// Express
const express = require("express");
const app = express();
const path = require("path");

// Cors site
const cors = require("cors");
const allowedOrigins = require("./config/allowedOrigins");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the list of allowed origins
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

app.use("/user", require("./routes/userRouter"));

app.get("/", (req, res) => {
  res.json({ message: "Ok" });
});

app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

module.exports = app;
