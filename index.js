const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api-routes');

// use environment
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', apiRouter);
app.use(bodyParser.json());

// set views

app.set('views', 'views');
app.set('view engine', 'ejs');
// set routes for public files serving
app.use(express.static('public'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));

// redirect to /qa page
app.get('/', (req, res) => res.redirect('/qa'));
// get all questions page
app.get('/qa', (req, res, next) => {
	res.sendFile(path.join(__dirname + '/views/index.html'));
});

//add new question
app.post('/', (req, res) => {
	console.log(req.body);
});

//view single question page
app.get('/qa/:id', (req, res, next) => {
	res.sendFile(path.join(__dirname + '/views/singleQA.html'));
});
// get votes for a question page
app.get('/qa/:id/result', (req, res, next) => {
	res.sendFile(path.join(__dirname + '/views/results.html'));
});

console.log(process.env.PORT);

app.listen(process.env.PORT, () =>
	console.log('server is running on port ' + process.env.PORT)
);
