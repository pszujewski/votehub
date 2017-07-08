const passport = require("passport");
const { BasicStrategy } = require("passport-http");
const BearerStrategy = require("passport-http-bearer").Strategy;

const { validatePassword } = require("./password");

const knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

const basicStrategy = new BasicStrategy((username, password, callback) => {
  let user;
  return knex
    .select("id", "email", "displayname", "password", "accesstoken")
    .from("users")
    .where("email", username)
    .then((_user) => {
      user = _user[0];
      return validatePassword(password, user.password);
    })
    .then((isValid) => {
      if (!isValid) {
        return callback(null, false, { message: `Incorrect password for user ${username}` });
      }
      return callback(null, Object.assign({}, user, { password: "classified" }));
    })
    .catch(err => console.log(err));
});

const bearerStrategy = new BearerStrategy((token, done) => {
  return knex
    .select("id", "email", "displayname", "accesstoken")
    .from("users")
    .where("accesstoken", token)
    .then((user) => {
      /*
       Need to confirm this when working on client!
      */ 
      console.log(user);
      if (user.length < 1) {
        return done(null, false);
      }
      return done(null, user[0]);
    })
    .catch(err => console.log(err));
});

passport.use(basicStrategy);

passport.use(bearerStrategy);

module.exports = { passport };
