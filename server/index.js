require("dotenv").config();
const app = require("./app");

// PORT = process.env.NODE_PORT;
PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on prot ${PORT}`);
});
