const mongoose = require("mongoose");

const OtpSchema = mongoose.Schema(
  {
    otp: { type: Number },
    used: { type: Boolean, default: false },
    email: { type: String },
    attempts: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = function (community = process.env.PROJECT_NAME) {
  return mongoose.model(`${community}_otps`, OtpSchema);
};
