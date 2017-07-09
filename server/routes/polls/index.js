const express = require("express");
const { passport } = require("../../auth/strategies");
const jsonParser = require("body-parser").json();

// const {
 
// } = require("./controllers");

const router = express.Router();

router.use(passport.initialize());

// Router endpoints
// create poll and choices
// get all polls in db -> don't need each choice though
// get poll and choices based on id
// update a poll's choice to add a vote


module.exports = { pollsRouter: router };
