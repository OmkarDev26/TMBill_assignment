const express = require("express");

const app = express();
require("dotenv").config();
require("./mongoose");
const routes = require("./routes");
const PORT = 3000;

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server started running on port: ${PORT}`);
});
