const express = require("express");

const router = express.Router();
const authController = require("../controllers/auth");

router.get("/", (req, res) => res.send("Auth check"));

router.post("/signup", async (req, res, next) => {
  try {
    let payload = {
      ...req.body,
    };
    const data = await authController.signup(payload);
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
    };
    const data = await authController.login(payload);
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
    };
    const data = await authController.logout(payload);
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/sendOTP", async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
    };
    const data = await authController.sendOTP(payload);
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/authenticate", async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
    };
    const data = await authController.authenticateUser(payload);
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/change_password", async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
    };
    const data = await authController.changePassword(payload);
    res.send(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
