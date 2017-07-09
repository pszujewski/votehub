const randomToken = require("random-token");
const { hashPassword } = require("../../auth/password");

const knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

const createUser = (req, email, hash) => {
  const accesstoken = randomToken(16);
  const displayname = `${req.body.firstName} ${req.body.lastName}`;
  const user = { email, displayname, accesstoken, password: hash };
  return knex.insert(user)
    .returning(["email", "displayname", "accesstoken"])
    .into("users")
    .then(result => result[0]);
};

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
    .then(hash => createUser(req, email, hash))
    .then(newUser => res.status(201).json(newUser))
    .catch(err => res.status(500).send(err));
};

exports.logIn = (req, res) => res.status(200).json(req.user);

// Need a controller that fetches all of a user's polls.

exports.getUsersPolls = (req, res) => {
  const { userId } = req.params;
  return knex.select("polls.id as poll_id", "created_by", "date", "question", "choices.id as choice_id", "content", "votes")
    .from("polls")
    .where("created_by", userId)
    .innerJoin("choices", "polls.id", "choices.poll_id")
    .then((results) => {
      // Combine the results
      // Using the treeize package
      // const myRestaurant = new Treeize();
      // myRestaurant.grow(results);
      // return res.status(200).json(myRestaurant.getData());
      console.log(results);
      return res.status(200).json(results);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

