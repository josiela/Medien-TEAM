//Initialisiere Datenbanken
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('meetyourcity.db');

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

//------------Sessionvariablen---------------//
app.get('/', function(req, res) {
	if(!req.session.authenticated) {
		res.render('start-login');
	}
	else {
		res.render('home', {
			'username': req.session.user.name
		});
	}
});

app.post('/sendLogin', function(req, res) {
	//in Datenbank gucken
	const user = req.body["username"];
	const password = req.body["password"];
	db.get(`SELECT * FROM users WHERE username='${user}'`, function(err, row) {
		if (row != undefined) {
			//Wenn ja, schau ob das Password richtig ist
			if(password == row.password) {
				//hat geklappt
				//Sessionvariable setzen
				req.session['user'] = user;
				req.session.authenticated = true;
				res.redirect('/home');
			}else{
				//hat nicht geklappt weil password falsch
				res.redirect('/loginerror');
			}
		}else{
			//hat es nicht geklappt, weil kein User mit dem Namen
			res.redirect('/loginerror');
		}
		//Falls ein Fehler auftritt in der Abfrage, gebe ihn aus
		if(err){
			console.error(err.message);
		}
	});
});

app.get('/logout', function(req, res){
	delete req.session['user'];
	res.redirect('/start-login');
});
//==========================================//

app.get('/start-login', function(req, res) {
	res.render('start-login');
});

app.get('/home', function(req, res) {
	res.render('home');
});

app.get('/loginerror', function(req, res) {
	res.render('loginerror');
});

app.get('/erste_schritte', function(req, res) {
	res.render('erste_schritte');
});

app.get('/veranstaltung_unterseite', function(req, res) {
	res.render('veranstaltung_unterseite');
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

app.get('/registrierung', function(req, res) {
	res.render('registrierung');
});


//----------DB Registrierung--------------//

app.post('/registrierung', function(req, res) {
	const { email, password, username } = req.body;
		// validierung
	db.run(`INSERT INTO users(email,password,username) VALUES(?, ?, ?)`, [email, password, username], function(err) {
		 if (err) {
			 return console.log(err.message);
		 }
		 return res.redirect('/erste_schritte');
	 });
});

//=======================================//
//Called when a URL is called that is not implemented
app.use((request, response, next) => {
	response.status(404).render('error');
});
