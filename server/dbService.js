const mysql = require('mysql2');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

//mysql db configuration
const db = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,

	multipleStatements: true,
});

//check DB connection
db.connect((err) => {
	if (err) {
		console.log(err.message);
	}
	console.log('Connected to a database!');
});

//DB queries
class DbService {
	static getDbServiceInstance() {
		return instance ? instance : new DbService();
	}
	// get all questions
	async getAllData() {
		try {
			const response = await new Promise((resolve, reject) => {
				const query = 'SELECT * FROM questions;';

				db.query(query, (err, results) => {
					if (err) {
						reject(new Error(err.message));
					}
					resolve(results);
				});
			});
			console.log(response);
			return response;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
	// get a single question
	async getSingleQuestion(id) {
		try {
			const response = await new Promise((resolve, reject) => {
				const query =
					'SELECT questions.id AS id_question, questions.question, answers.id AS id_answer, answers.answer FROM questions JOIN answers ON questions.id = answers.id_questions WHERE questions.id = (?);';

				db.query(query, [id], (err, results) => {
					if (err) {
						reject(new Error(err.message));
					}
					resolve(results);
				});
			});
			console.log(response);
			return response;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
	// add a new question
	async addNewQuestion(question, answers) {
		try {
			const response = await new Promise((resolve, reject) => {
				let queryInitialPart =
					'BEGIN; INSERT INTO questions (question) VALUES (?); SET @last_id_in_table1 = LAST_INSERT_ID();  INSERT INTO answers (answer, id_questions) VALUES ';
				let queryAddedPart = '(?, @last_id_in_table1)';
				let queryCommitPart = 'COMMIT';

				for (let i = 0; i < answers.length; i++) {
					if (i + 1 == answers.length) {
						queryInitialPart += queryAddedPart + ';';
					} else {
						queryInitialPart += queryAddedPart + ',';
					}
				}
				queryInitialPart += queryCommitPart;

				let insertedVars = [];
				insertedVars.push(question);

				insertedVars = insertedVars.concat(answers);

				db.query(queryInitialPart, insertedVars, (err, results) => {
					if (err) {
						reject(new Error(err.message));
					}
					resolve(results);
				});
			});
			console.log(response);
			return response;
		} catch (err) {
			console.log(err);
			return false;
		}
	}
	// add a new vote to question's answer

	async addNewVote(count, id_answers, id_questions) {
		try {
			const response = await new Promise((resolve, reject) => {
				const searchQuery = 'SELECT * FROM votes WHERE votes.id_answers = (?)';

				const insertQuery =
					'INSERT INTO votes (count, id_answers, id_questions) VALUES (?, ?, ?);';

				const updateQuery =
					'UPDATE votes SET count = count+1  WHERE votes.id_answers = (?);';

				db.query(searchQuery, [id_answers], (err, results, fields1) => {
					if (results.length == 0) {
						db.query(
							insertQuery,
							[count, id_answers, id_questions],
							(err, res1) => {
								if (err) {
									reject(new Error(err.message));
								}
								resolve(res1);
							}
						);
					} else {
						db.query(updateQuery, [id_answers], (err, res1) => {
							if (err) {
								reject(new Error(err.message));
							}
							resolve(res1);
						});
					}
					console.log(results.length);
				});
			});
			console.log(response);
			return response;
		} catch (err) {
			console.log(err);
			return false;
		}
	}
	// get votes for a question
	async getVotesCount(id_question) {
		try {
			const response = await new Promise((resolve, reject) => {
				const query =
					'SELECT questions.question,votes.id_answers, answers.answer, votes.count FROM questions JOIN answers ON questions.id = answers.id_questions JOIN votes ON answers.id = votes.id_answers WHERE votes.id_questions = (?)';

				db.query(query, [id_question], (err, results) => {
					if (err) {
						reject(new Error(err.message));
					}
					resolve(results);
				});
			});
			console.log(response);
			return response;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
	// delete a question
	async deleteQuestion(id_question) {
		try {
			const response = await new Promise((resolve, reject) => {
				const deleteVotesQuery =
					'BEGIN; DELETE FROM votes WHERE votes.id_questions= (?);';

				const deleteAnswersQuery =
					'DELETE FROM answers WHERE answers.id_questions= (?);';

				const deleteQuestionQuery =
					'DELETE FROM questions WHERE questions.id= (?); COMMIT;';

				const finalDeleteQuery =
					deleteVotesQuery + deleteAnswersQuery + deleteQuestionQuery;

				console.log(finalDeleteQuery);

				db.query(
					finalDeleteQuery,
					[id_question, id_question, id_question],
					(err, results) => {
						if (err) {
							reject(new Error(err.message));
						}
						resolve(results);
					}
				);
			});
			console.log(response);
			return response;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}

module.exports = DbService;
