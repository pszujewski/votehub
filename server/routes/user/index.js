const express = require("express");
const { passport } = require("../../auth/strategies");
const jsonParser = require("body-parser").json();

const {
  signUp,
  logIn,
} = require("./controllers");

const router = express.Router();

router.use(passport.initialize());

// Router endpoints
router.post("/sign-up", jsonParser, signUp);

router.get("/log-in", passport.authenticate("basic", { session: false }), logIn);

router.get("/me",
  passport.authenticate("bearer", { session: false }),
  (req, res) => res.status(200).json(req.user));

module.exports = { userRouter: router };
