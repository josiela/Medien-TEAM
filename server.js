//Initialisiere Datenbanken
const sqlite3 = require('sqlite3').verbose();

// Express.js Webserver
const express = require('express');
const app = express()

// Body-Parser
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// EJS
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

//CSS Ordner einbinden
app.use(express.static(__dirname + "/style"));

// Sessionvariablen
const session = require('express-session');
app.use(session({
	secret: 'example',
	resave: false,
	saveUninitialized: true
}));

// Passwort Verschlüsselung
const bcrypt = require('bcrypt');

// Webserver starten http://localhost:3000
app.listen(3000, function(){
	console.log("listening on 3000");
});

//---------------------------------------------//

app.get('/erste_schritte', function(req, res) {
  res.render('erste_schritte');
});

//app.post('/erste_schritte', function(req, res) {
//	const db = new sqlite3.Database()
//	const {wohnort, interessen} = req.body;

//	db.run(`INSERT INTO profilinfo()`)
//});

//app.post('/registrierung', function(req, res) {
//	const db = new sqlite3.Database('meetyourcity.db');
//	const { email, password, username } = req.body;
		// validierung
//	db.run(`INSERT INTO users(email,password,username) VALUES(?, ?, ?)`, [email, password, username], function(err) {
//		 if (err) {
//			 return console.log(err.message);
//		 }
//		 return res.redirect('/erste_schritte')
//	 });
//	 db.close();
//});
//============================================//
app.get('/home', function(req, res) {
  res.render('home');
});

app.get('/loginerror', function(req, res) {
  res.render('loginerror');
});

app.get('/neue_Veranstaltung', function(req, res) {
  res.render('neue_Veranstaltung');
});

app.get('/profil_bearbeiten', function(req, res) {
  res.render('profil_bearbeiten');
});
app.get('/profil', function(req, res) {
  res.render('profil');
});

//----------DB Registrierung--------------//

app.get('/registrierung', function(req, res) {
	res.render('registrierung');
});

app.post('/registrierung', function(req, res) {
	const db = new sqlite3.Database('meetyourcity.db');
	const { email, password, username } = req.body;
		// validierung
	db.run(`INSERT INTO users(email,password,username) VALUES(?, ?, ?)`, [email, password, username], function(err) {
		 if (err) {
			 return console.log(err.message);
		 }
		 return res.redirect('/erste_schritte')
	 });
	 db.close();
});

//app.all('/registrierung', function(req, res) {
//	const db = new sqlite3.Database('meetyourcity.db');
//	const { email, password, username } = req.body;
	// validierung
//	db.run(`INSERT INTO users(email,password,username) VALUES(?, ?, ?)`, [email, password, username], function(err) {
//		 if (err) {
//			 return console.log(err.message);
//		 }
//	 });
//   res.render('registrierung');
//	 db.close();
//});

//=======================================//

//----------DB Login---------------------//

app.get('/start-login', function(req, res) {
  res.render('start-login');
});

app.post('/start-login', function(req, res) {
	const db = new sqlite3.Database('meetyourcity.db');
	db.get(`SELECT * FROM users WHERE username=? AND password=?`, [req.body.username, req.body.password], function(err, row) {
		 if (err) {
			 return console.log(err.message);
		 }
		 if (row) {
			 return res.redirect('/home')
		 }
		 return res.redirect('/loginerror')
	 });
	 db.close();
});
//=========================================//


app.get('/veranstaltung_unterseite', function(req, res) {
  res.render('veranstaltung_unterseite');
});
