const { hashPassword } = require("../../auth/password");

const knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

const createUser = (req, email, hash) => {
  const accesstoken = "accesstoken";
  const displayname = `${req.body.firstName}${req.body.lastName}`;
  const row = { email, displayname, accesstoken, password: hash };
  console.log(row);
  return knex.insert(row).into("users").then(result => result);
};

//.returning(["email", "displayname", "accesstoken"])

exports.signUp = (req, res) => {
  // check validity of email and password
  const { password, email } = req.body;
  const regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValidPW = password.length > 5 && password.length < 30;
  const isValidEmail = regExpEmail.test(email);
  if (!isValidPW || !isValidEmail) {
    console.log("invalid");
    const message = "Please enter a valid email and password";
    return res.status(400).json({ message });
  }
  // Does the user already exist?
  return knex("users")
    .where("email", email)
    .then((_user) => {
      if (_user.length > 0) {
        const message = `User ${req.body.email} already exists`;
        return res.status(400).json({ message });
      }
      return hashPassword(password);
    })
    .then(hash => createUser(req, email, password))
    .then(newUser => res.status(201).json(newUser))
    .catch(err => res.status(500).send(err));
};

// Need a controller that fetches all of a user's polls.

exports.logIn = (req, res) => res.status(200).json(req.user);

