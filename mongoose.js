const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://omkardevrukhkar0:xXqIkV6UNGegWSMF@elred.wtabeyp.mongodb.net/?retryWrites=true&w=majority&appName=elRed"
  )
  .then(() => console.log("Connected!"));
