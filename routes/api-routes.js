const express = require('express');
const dbService = require('../server/dbService');
var router = express.Router();

// get all questions
router.get('/getAll', (req, res) => {
	const db = dbService.getDbServiceInstance();

	const result = db.getAllData();
	if (!result) return res.status(409).json({ err: true });
	return result
		.then((data) => res.send(data))
		.catch((err) => res.status(409).json({ err }));
});

// add a question
router.post('/postNew', (req, res) => {
	const { question, answers } = req.body.newQuestion;

	const db = dbService.getDbServiceInstance();

	const result = db.addNewQuestion(question, answers);
	if (!result) return res.status(409).json({ err: true });

	return result
		.then((data) => res.json(data))
		.catch((err) => res.status(409).json({ err }));
});

// get a single question
router.get('/:id', (req, res) => {
	const db = dbService.getDbServiceInstance();

	const result = db.getSingleQuestion(req.params.id);
	if (!result) return res.status(409).json({ err: true });

	return result
		.then((data) => res.json(data))
		.catch((err) => res.status(409).json({ err }));
});
// delete a question
router.delete('/:id/delete', (req, res) => {
	const db = dbService.getDbServiceInstance();

	const result = db.deleteQuestion(req.params.id);
	if (!result) return res.status(409).json({ err: true });

	return result
		.then((data) => res.json(data))
		.catch((err) => res.status(409).json({ err }));
});

// add a vote to a answer
router.post('/postVote', (req, res) => {
	const { count, id_answers, id_questions } = req.body.voteStructure;

	const db = dbService.getDbServiceInstance();

	const result = db.addNewVote(count, id_answers, id_questions);
	if (!result) return res.status(409).json({ err: true });

	return result
		.then((data) => res.json(data))
		.catch((err) => res.status(409).json({ err }));
});

// get votes for a question's answer
router.get('/:id/getVotes', (req, res) => {
	const db = dbService.getDbServiceInstance();

	const result = db.getVotesCount(req.params.id);
	if (!result) return res.status(409).json({ err: true });
	return result
		.then((data) => res.send(data))
		.catch((err) => res.status(409).json({ err }));
});

module.exports = router;
