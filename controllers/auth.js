const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { randomBytes } = require("crypto");
const usersModel = require("../models/auth");
const otpModel = require("../models/otp");
const generateOTP = require("../helper/generateOTP");
const sendMail = require("../helper/sendEmail");

const authController = {};

authController.signup = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const salt = randomBytes(32);
      const hashedPsd = await argon2.hash(data.password, { salt });
      const payload = {
        ...data,
        password: hashedPsd,
      };

      const user = await usersModel().create(payload);
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

authController.login = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = jwt.verify(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDYxMDM2MTQsImRhdGEiOnsiX2lkIjoiNjgxMzVkMGZmYmYxNmY5YWUxNmJiZGI1IiwicGFzc3dvcmQiOiIkYXJnb24yaWQkdj0xOSRtPTY1NTM2LHQ9MyxwPTQkd2F2VHdVVXpiN0pVSEd6SFFpVFpiUSRSZ3BSOVZVNE5qYTdzRHEyTFpzck5XRlF3bDNRQ1JqZUVIS2FmcTVHSHRFIiwiZW1haWwiOiJvbWthckBnbWFpbC5jb20iLCJjcmVhdGVkQXQiOiIyMDI1LTA1LTAxVDExOjM3OjUxLjA0OVoiLCJ1cGRhdGVkQXQiOiIyMDI1LTA1LTAxVDExOjM3OjUxLjA0OVoiLCJfX3YiOjB9LCJpYXQiOjE3NDYxMDAwMTR9.v470pCzx2iRQyqGejtzddkFTAs_TbqFd5ise4G94sqk",
        "secretjwtforauth"
      );
      resolve(data);
      const checkUser = await usersModel().findOne({ email: data.email });
      if (!checkUser) {
        resolve("User not registered");
      }

      const checkPassword = await argon2.verify(
        checkUser.password,
        data.password
      );
      if (checkPassword) {
        Reflect.deleteProperty(checkUser, checkUser.password);
        const jwtToken = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: checkUser,
          },
          "secretjwtforauth"
        );
        await usersModel().updateOne(
          { _id: checkUser._id },
          { token: jwtToken }
        );
        resolve(jwtToken);
      } else resolve("Invalid credentials");
    } catch (error) {
      reject(error);
    }
  });
};

authController.logout = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await usersModel().updateOne({ _id: checkUser._id }, { token: "" });
    } catch (error) {
      reject(error);
    }
  });
};

authController.sendOTP = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkUser = await usersModel().find({ email: data.email });
      if (checkUser) {
        let otp = generateOTP();

        await sendMail(data.email, otp);

        await otpModel().findOneAndUpdate(
          { email: data.email },
          {
            email: data.email,
            used: false,
            otp,
            $inc: { attempts: 1 },
          },
          { new: true }
        );

        resolve({ code: 200, message: "OTP Sent" });
      }
    } catch (error) {
      reject(error);
    }
  });
};

authController.authenticateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await otpModel().findOne({
        email: data.email,
        otp: data.otp,
        used: false,
      });

      if (user) {
        let checkTimer =
          new Date() < new Date(user.updatedAt.getTime() + 5 * 60 * 1000);
        if (!checkTimer) {
          resolve({ code: 200, message: "OTP Expired", success: false });
        } else {
          resolve({ code: 200, message: "User Authenticated", success: true });
        }
        await otpModel().updateOne({ email: data.email }, { used: true });
        resolve({ code: 200, message: "User Authenticated", success: true });
      } else {
        resolve({
          code: 200,
          message: "Incorrect OTP",
          success: false,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

authController.changePassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkOTP = await otpModel().findOne({
        email: data.email,
        otp: data.otp,
        used: true,
      });

      if (checkOTP) {
        const salt = randomBytes(32);
        const hashedPsd = await argon2.hash(data.password, { salt });
        await usersModel().updateOne(
          { email: data.email },
          { password: hashedPsd }
        );
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = authController;
