const express = require("express");
const { passport } = require("../../auth/strategies");
const jsonParser = require("body-parser").json();

const {
 createPoll,
 getAllPolls,
 getUsersPolls,
 findOnePoll,
} = require("./controllers");

const router = express.Router();

router.use(passport.initialize());

// Router endpoints
// create poll and choices
router.post("/create/:userId", jsonParser, createPoll);

// get all polls in db -> don't need each choice though
router.get("/all", getAllPolls);

// get all polls a user created.
router.get("/user-created/:userId", getUsersPolls);

// get poll and choices based on id
router.get("/one", findOnePoll);

// update a poll's choice to add a vote based on choice id


module.exports = { pollsRouter: router };
