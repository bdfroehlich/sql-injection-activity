const sqlite3 = require('sqlite3').verbose();
const http = require('http'),
	path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser');

const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
 db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
 db.run("INSERT INTO user VALUES ('bdfroehlich', 'password8', 'Administrator')");
 db.run("INSERT INTO user VALUES ('bdfroehlich2', 'password9', 'User1')");
 db.run("INSERT INTO user VALUES ('bdfroehlich3', 'password10', 'User2')");
});

//send HTML to browser
app.get('/', function (req, res) {
    res.sendFile('index.html');
});


app.post('/login', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var query = "SELECT title FROM user where username = '" + username + "' and password = '" + password + "'";

	console.log("user: " + username);
	console.log("pass: " + password);
	console.log('query: ' + query);

	db.get(query, function (err, row) {

		if (err) {
			console.log('ERROR', err);
			res.redirect("/index.html#error");
		} else if (!row) {
			res.redirect("/index.html#unauthorized");
		} else {
			res.send('Hello <b>' + row.title + '!</b><br /> This file contains your data: <br /><br /> List of items: <br /><br /> Item #1 <br /><br /> Item #2 <br /><br /> <a href="/index.html">Login Page</a>');
		}
	});

});

app.listen(3000);

