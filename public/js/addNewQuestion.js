// add a new question to database
const addNewQuestion = () => {
	const question = document.getElementById('question');
	const answerInputsValues = [];
	const answerInputs = document.querySelectorAll('.answer-input');

	// add answers to array
	answerInputs.forEach((element) => {
		if (element.value.length == 0) {
			console.log('answer field is empty');
		} else {
			answerInputsValues.push(element.value);
		}
		console.log(answerInputsValues);
	});

	// check fields
	if (question.value.length == 0) {
		alert('Question Field cannot be empty');
	} else if (answerInputsValues.length < 2) {
		alert('Please, provide at least 2 answers');
	} else {
		// send question with answers to api
		let newQuestion = {
			question: question.value,
			answers: answerInputsValues,
		};

		fetch('http://localhost:3001/api/postNew', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ newQuestion: newQuestion }),
		})
			.then((response) => {
				console.log('added new q');
			})
			.catch((e) => alert('Something went wrong'));
		// clear inputs
		question.value = '';
		answerInputs.forEach((input) => {
			input.value = '';
		});
	}
};
