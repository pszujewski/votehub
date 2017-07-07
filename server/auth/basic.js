const passport = require("passport");
const { BasicStrategy } = require("passport-http");

const { validatePassword } = require("./password");

const knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

const basicStrategy = new BasicStrategy((username, password, callback) => {
  let user;
  return knex
    .select("id", "email", "displayname", "password")
    .from("users")
    .where("email", username)
    .then((_user) => {
      user = _user;
      return validatePassword(password, _user.password);
    })
    .then((isValid) => {
      if (!isValid) {
        return callback(null, false, { message: `Incorrect password for user ${username}` });
      }
      return callback(null, Object.assign({}, user, { password: "classified" }));
    })
    .catch(err => console.log(err));
});

passport.use(basicStrategy);

module.exports = { passport };
