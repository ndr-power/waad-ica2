let currentWindowLocation = window.location.pathname;
let index = currentWindowLocation.split('/')[2];
// load data
document.addEventListener('DOMContentLoaded', () => {
	findQA();
});

// get question's data
const findQA = () => {
	let dataArr;
	fetch(`http://localhost:3001/api/${index}`)
		.then((response) => response.json())
		.then((data) => {
			dataArr = data;
		
	let finalQuestion = dataArr[0].question;
	let output = [];

	const questionField = document.getElementById('question');
	const answersListContainer = document.getElementById('answers-list');

	for (let i = 0; i < dataArr.length; i++) {
		output += generateAnswersStructure(dataArr[i].id_answer, dataArr[i].answer);
	}

	questionField.innerHTML = finalQuestion;
	answersListContainer.innerHTML = output;
    })
    .catch((e) => alert('Something went wrong'));
};
// generate answer structure
const generateAnswersStructure = (id, answer) => {
	return `
                <li>
                    <input type="radio" name="answer" id=${id} class="answer">
                    <label for=${id}>${answer}</label>
                </li>
            `;
};

let radioBtnChecked = false;
// post a vote to API
const setSingleVote = () => {
	const id_answ = findRadioValue();
	const id_quest = index;

	const voteStructure = {
		count: 1,
		id_answers: id_answ,
		id_questions: id_quest,
	};

	if (radioBtnChecked) {
		fetch('http://localhost:3001/api/postVote', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ voteStructure: voteStructure }),
		})
			.then((response) => {
				if (response.status == 200) {
					console.log('added a vote');
				}
			})
			.catch((e) => alert('Something went wrong'));

		window.location.href = `/qa/${index}/result`;
	} else {
		alert('Please, provide your answer');
	}
};
// redirect to results page
const showResults = () => {
	window.location.href = `/qa/${index}/result`;
};
// get radio button selected value
const findRadioValue = () => {
	let ele = document.getElementsByName('answer');

	for (i = 0; i < ele.length; i++) {
		if (ele[i].checked) {
			radioBtnChecked = true;
			return ele[i].id;
		} else {
			radioBtnChecked = false;
		}
	}
};
// delete a question
const deleteQuestion = () => {
	fetch(`http://localhost:3001/api/${index}/delete`, { method: 'DELETE' });

	window.location.href = '/';
};
