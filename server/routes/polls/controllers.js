function insertPoll(question, userId) {
  const newPoll = {
    created_by: Number(userId),
    question,
  };
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
