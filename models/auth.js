const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String },
    password: { type: String },
    email: { type: String },
    token: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = function (community = process.env.PROJECT_NAME) {
  return mongoose.model("user", userSchema);
};
