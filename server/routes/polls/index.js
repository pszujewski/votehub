const express = require("express");
const { passport } = require("../../auth/strategies");
const jsonParser = require("body-parser").json();

const {
 createPoll,
} = require("./controllers");

const router = express.Router();

router.use(passport.initialize());

// Router endpoints
router.post("/create/:userId", jsonParser, createPoll);
// get all polls in db -> don't need each choice though
// get poll and choices based on id
// update a poll's choice to add a vote


module.exports = { pollsRouter: router };
