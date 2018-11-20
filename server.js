//Initialisiere Datenbanken
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('meetyourcity.db');

// Express.js Webserver
const express = require('express');
const app = express()

// Body-Parser
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// EJS
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

//CSS Ordner einbinden
app.use(express.static(__dirname + "/style"));

// Sessionvariablen
const session = require('express-session');
app.use(session({
	secret: 'meetyourcity',
  resave: true,
  saveUninitialized: false,
}));

// Passwort Verschlüsselung
const bcrypt = require('bcrypt');

// Webserver starten http://localhost:3000
app.listen(3000, function(){
	console.log("listening on 3000");
});

let requiresLogin = function(req, res, next) {
  if (!req.session.user) {
		res.redirect('/start-login');
		//wofür? Hierdurch treten Fehler auf in der Powershell wenn man auf der Startseite ist
    next();
  }
  return next();
};

//---------------------------------------------//

//------------Sessionvariablen---------------//
app.get('/', requiresLogin, function(req, res) {
	res.redirect('/home');
});

app.post('/sendLogin', function(req, res) {
	//in Datenbank gucken
	const user = req.body["username"];
	const password = req.body["password"];
	db.get(`SELECT * FROM users WHERE username='${user}'`, function(err, row) {
		if(err){
			console.error(err.message);
		}
		if (row != undefined) {
			//Wenn ja, schau ob das Password richtig ist
			if(password == row.password) {
				//hat geklappt
				//Sessionvariable setzen
				req.session['user'] = user;
				req.session['email'] = row.email;
				req.session['location'] = row.wohnort;
				req.session['info'] = row.info;

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
	});
});

app.get('/logout', function(req, res){
	req.session.destroy(function (err) {
	  if (err) return next(err)
		req.session = null;
	  res.redirect('/start-login');
	});
});
//==========================================//

app.get('/start-login', function(req, res) {
	res.render('start-login');
});

app.get('/home', requiresLogin, function(req, res) {
	res.render('home');
});

app.get('/loginerror', function(req, res) {
	res.render('loginerror');
});

app.get('/veranstaltung_unterseite', requiresLogin, function(req, res) {
	res.render('veranstaltung_unterseite');
});

app.get('/neue_Veranstaltung', requiresLogin, function(req, res) {
	res.render('neue_Veranstaltung');
});

app.get('/erste_schritte', requiresLogin, function(req, res) {
	res.render('erste_schritte');
})

app.get('/profil_bearbeiten', requiresLogin, function(req, res) {
	res.render('profil_bearbeiten');
});


//Infos werden geholt und in der Sitzung gespeichert
app.get('/profil', requiresLogin, function(req, res) {
	// !req.session.user ? res.redirect('/start-login') : null;
	// !req.session.email ? req.session['email'] = '' : null;
	// !req.session.location ? req.session['location'] = '' : null;
	// !req.session.info ? req.session['info'] = '' : null;

	db.get(`SELECT * FROM users WHERE username='${req.session.user}'`, function(err, row) {
		if(err){
			console.error(err.message);
		}
		if (row != undefined) {
			res.render('profil', {
				user: req.session.user,
				email: row.email,
				location: row.wohnort,
				info: row.info,
			});
	} else {
	}
});

//Darstellen auf der Seite
});

app.get('/registrierung', function(req, res) {
	res.render('registrierung');
});


//----------DB Registrierung--------------//

app.post('/registrierung', function(req, res) {
	const { email, password, username, wohnort } = req.body;
		// validierung
	db.run(`INSERT INTO users(email,password,username,wohnort) VALUES(?, ?, ?, ?)`, [email, password, username, wohnort], function(err) {
		 if (err) {
			 return console.log(err.message);
		 }else{
		 		req.session.user = username;
		 		return res.redirect('/erste_schritte');
			}
	 });
});

app.post('/profil_bearbeiten', function(req, res) {
	const {wohnort, info } = req.body;
	//	validierung
	db.run(`UPDATE users SET wohnort='${wohnort}', info='${info}' WHERE username='${req.session.user}';`, function(err) {
		 if (err) {
			 return console.log(err.message);
		 }else{
		 		return res.redirect('/profil');
			}
	 });
});

app.post('/neue_Veranstaltung', function(req, res) {
	const { eventname, eventlocation, date, time, eventinfo } = req.body;
		// validierung
	db.run(`INSERT INTO events(eventname,eventlocation,date,time,eventinfo) VALUES(?, ?, ?, ?, ?)`, [eventname, eventlocation, date, time, eventinfo], function(err) {
		 if (err) {
			 return console.log(err.message);
		 }else{
		 		return res.redirect('/veranstaltung_unterseite');
			}
	 });
});
	//=======================================//
//Called when a URL is called that is not implemented
app.use((request, response, next) => {
	response.status(404).render('error');
});
