const knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

function insertPoll(question, userId) {
  const created_by = Number(userId);
  const newPoll = { created_by, question };
  return knex.insert(newPoll)
    .returning(["id", "created_by", "question"])
    .into("polls")
    .then((result) => {
      console.log(result);
      return result;
    });
}

function insertChoice(pollId, choice) {
  const newChoice = {
    poll_id: pollId,
    content: choice,
  };
  return knex.insert(newChoice)
    .returning(["id", "poll_id", "content", "votes"])
    .into("choices")
    .then(result => result);
}

exports.createPoll = (req, res) => { // to review and test
  const { userId } = req.params;
  const { question, choices } = req.body;
  let poll;
  return insertPoll(question, userId)
    .then((newPoll) => {
      poll = newPoll;
      poll.choices = [];
      console.log(newPoll);
      for (let i = 0; i < choices.length; i += 1) {
        poll.choices.push(insertChoice(poll.id, choices[i]));
      }
      return Promise.all(poll.choices);
    })
    .then((complete) => {
      console.log(complete);
      return res.status(200).json(poll);
    })
    .catch(err => res.status(500).json(err));
};

exports.getAllPolls = (req, res) => {
  return knex.select("*")
    .from("polls")
    .then(polls => {
      console.log(polls);
      return res.status(200).json(polls);
    })
    .catch(err => res.status(500).json(err));
};

exports.getUsersPolls = (req, res) => {
  return knex.select("*")
    .from("polls")
    .where("created_by", req.params.userId)
    .then(polls => { 
      console.log(polls);
      return res.status(200).json(polls);
    })
    .catch(err => res.status(500).json(err));
};

function getPollById(pollId) {
  return knex.select("*")
    .from("polls")
    .where("id", pollId)
    .then((poll) => {
      console.log(poll);
      return poll[0];
    });
}

function getChoicesByPollId(pollId) {
  return knex.select("*")
    .from("choices")
    .where("poll_id", pollId)
    .then((choices) => {
      console.log(choices);
      return choices;
    });
}

exports.findOnePoll = (req, res) => {
  const { pollId } = req.params;
  const data = [];
  data.push(getPollById(pollId));
  data.push(getChoicesByPollId(pollId));
  return Promise.all(data)
    .then(data => {
      // combine the data before sending to client
      console.log(data);
      return res.status(200).json(data);
    })
    .catch(err => res.status(500).json(err));
};

