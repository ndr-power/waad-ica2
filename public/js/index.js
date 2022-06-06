document.addEventListener('DOMContentLoaded', () => {
	getQuestionList();
});
// fetch question list from api
const getQuestionList = () => {
	fetch('http://localhost:3001/api/getAll')
		.then((data) => data.json())
		.then((json) => updateUI(json))
		.catch((e) => alert('Something went wrong'));
};

// init field count
let fieldsCount = 2;
// add a field to answers
const addAnswerField = () => {
	//saves current user input values
	let answerInputs = document.querySelectorAll('.answer-input');
	providedAnswerValues = [];

	answerInputs.forEach((element) => {
		providedAnswerValues.push(element.value);
	});

	//generates new inputs

	let formInner = document.getElementById('input_container');
	let newFieldBtn = document.getElementById('new_field');
	let output = [];
	fieldsCount++;

	if (fieldsCount == 7) {
		alert('Maximum amount of answers is 6');
	} else {
		if (fieldsCount == 6) newFieldBtn.style.display = 'none';
		for (let i = 0; i < fieldsCount; i++) {
			output += generateAnswerFieldStructure(providedAnswerValues, i);
		}
		formInner.innerHTML = output;
	}
};
// generate a field structure
const generateAnswerFieldStructure = (answersArr, arrIndex) => {
	return `
                    <input value="${
											answersArr[arrIndex] || ''
										}" class="answer-input" type="text" placeholder="Your answer...">
                `;
};
// generate question structure
const generateQuestionStructure = (question, questID) => {
	return `
                    <a href='/qa/${questID}'>
                    <article id = ${questID}>     
                        <span class="question-text">${question}</span>
                    </article>
            `;
};

// update user interface with new info
const updateUI = (questionArr) => {
	let questionList = document.getElementById('question_list');
	let output = [];

	questionList.innerHTML = '';

	for (let i = 0; i < questionArr.length; i++) {
		output += generateQuestionStructure(
			questionArr[i].question,
			questionArr[i].id
		);
	}

	questionList.innerHTML = output;
};
