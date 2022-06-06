let currentWindowLocation = window.location.pathname;
let index = currentWindowLocation.split('/')[2];

document.addEventListener('DOMContentLoaded', () => {
	getVotesCount();
});
let data = null;
const getVotesCount = () => {
	fetch(`http://localhost:3001/api/${index}/getVotes`)
		.then((data) => data.json())
		.then((json) => {
			console.log(json);
			data = json;
			generateResults();
		});
};
// generate structure for a result
const generateResultStructure = (answer, count) => {
	return `<li>
      <span>${answer}: ${count} </span>
          </li>`;
};
// generate results and update UI
const generateResults = () => {
	const questionField = document.getElementById('question');
	const answerLink = document.getElementById('answerRedirect');

	if (data.length == 0) {
		questionField.innerHTML = 'No answers yet!';
	} else {
		const answersListContainer = document.getElementById('results-list');
		let output = '';
		data
			.sort((a, b) => b.count - a.count)
			.map((val) => {
				output += generateResultStructure(val.answer, val.count);
			});
		console.log(output);
		answersListContainer.innerHTML = output;
		questionField.innerHTML = `Results to: ${data[0].question}`;
		answerLink.href = `/qa/${index}`;
	}
};
