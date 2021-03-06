//Initialisiere Datenbanken
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('meetyourcity.db');

// Express.js Webserver
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

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
		res.redirect('/');
  }
  return next();
};

//------------Sessionvariablen---------------//

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
				req.session['user'] = row.id;
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
	  res.redirect('/');
	});
});
//==========================================//

app.get('/', function(req, res) {
	res.render('start-login');
});

app.get('/loginerror', function(req, res) {
	res.render('loginerror');
});

app.get('/neue_Veranstaltung', requiresLogin, function(req, res) {
	res.render('neue_Veranstaltung');
});

app.get('/erste_schritte', requiresLogin, function(req, res) {
	res.render('erste_schritte');
})

app.get('/registrierung', function(req, res) {
	res.render('registrierung');
});

// Gemerkte UserEvents auf der Startseite anzeigen
app.get('/home', requiresLogin, function(req, res) {
		const sql = 'SELECT * FROM events';
		let userEvents = {};

		db.all(`SELECT DISTINCT users_events.events_id, users_events.user_id, events.eventname, events.eventlocation, events.date, events.time, events.eventinfo, events.eventtag FROM users_events INNER JOIN events ON users_events.events_id=events.id WHERE users_events.user_id=${req.session.user} `, function(err, row) {
			if(err){
				console.error(err.message);
			}
			if (row != undefined) {
				userEvents = row;
			} else {
					console.log("Keine Events gemerkt")
					};
		});

		db.all(sql, function(err, rows){
			if (err){
				console.log(err.message);
			}
			else{
				console.log(rows);
				res.render('home',  {
					'userEvents': userEvents,
					'rows': rows,
				});
			}
		});
	});

// Event suchen
app.post("/suchergebnis", requiresLogin, function(req, res) {
	const sql = 'SELECT * FROM events WHERE eventtag="' + req.body["search"] + "\"";
	console.log(sql);
	db.all(sql, function(err, row) {
		if (err){
			console.log(err.message);
		}
		else{
			console.log(row);
			res.render('suchergebnis', {
				'row': row
			});
		}
	});
})

// Veranstaltungen auf allgemeiner Veranstaltungsunterseite anzeigen
app.get('/veranstaltung_unterseite/:id', requiresLogin, function(req, res) {
	const sql = 'SELECT * FROM events WHERE id ='+req.params.id;
	console.log(sql);
	db.get(sql, function(err, row){
		if (err){
			console.log(err.message);
		}
		else{
			console.log(row);
			res.render('veranstaltung_unterseite',  {
				'row':  row
			});
		}
	});
});

// Neue Veranstaltung erstellen
app.post('/neue_Veranstaltung', function(req, res) {
	const { eventname, eventlocation, date, time, eventinfo, eventtag } = req.body;
		// validierung
	db.run(`INSERT INTO events(eventname,eventlocation,date,time,eventinfo,eventtag) VALUES(?, ?, ?, ?, ?, ?)`, [eventname, eventlocation, date, time, eventinfo, eventtag], function(err) {
		 if (err) {
			 console.log(err.message);
		 }else{
		 		res.redirect('/home');
			}
	 });
});

//Veranstaltung löschen
app.post('/deleteEvent', function(req,res){
	const sql =`DELETE FROM events WHERE id=(${req.body["delete"]})`;

	db.run(sql, function(err) {
		if (err){
			console.log(err.message);
		} else {
				console.log("Event gelöscht")
				res.redirect('/home');
		}
	});

	const sql2 = `SELECT * FROM users_events`
	db.all(sql2, function(err, rows) {
		console.log(rows);
	});

});

app.get('/profil_bearbeiten', requiresLogin, function(req, res) {
	db.get(`SELECT * FROM users WHERE id='${req.session.user}'`, function(err, row) {
		if(err){
			console.error(err.message);
		}
		if (row != undefined) {
				res.render('profil_bearbeiten', {
					currentLocation: row.wohnort,
					currentEmail: row.email,
					currentInfo: row.info
			});
	} else {
	}
	});
});

//Infos werden geholt und in der Sitzung gespeichert
app.get('/profil', requiresLogin, function(req, res) {
	db.get(`SELECT * FROM users WHERE id='${req.session.user}'`, function(err, row) {
		if(err){
			console.error(err.message);
		}
		if (row != undefined) {
			res.render('profil', {
				user: row.username,
				email: row.email,
				location: row.wohnort,
				info: row.info,
			});
	} else {
	}
	});
});


//----------DB Registrierung--------------//

app.post('/registrierung', function(req, res) {
	const { email, password, username, wohnort } = req.body;
		// validierung
	db.run(`INSERT INTO users(email,password,username,wohnort) VALUES(?, ?, ?, ?)`, [email, password, username, wohnort], function(err) {
		 if (err) {
			 console.log(err.message);
		 }else{
		 		req.session.user = this.lastID;
		 		res.redirect('/erste_schritte');
			}
	 });
});

app.post('/profil_bearbeiten', function(req, res) {
	const { wohnort, info, email } = req.body;
	//	validierung
	db.run(`UPDATE users SET wohnort='${wohnort}', info='${info}', email='${email}' WHERE id='${req.session.user}';`, function(err) {
		 if (err) {
				console.log(err.message);
		 }else{
		 		res.redirect('/profil');
			}
	 });
});

// Gemerkte Events speichern
app.post('/merken', function(req, res) {
	const sql = `INSERT INTO users_events (user_id, events_id) VALUES (${req.session.user}, ${req.body["eventId"]})`;

	db.run(sql, function(err) {
		if (err){
			console.log(err.message);
		} else {
				console.log("Event hinzugefügt")
				res.redirect('/home');
		}
	});

	const sql2 = `SELECT * FROM users_events`
	db.all(sql2, function(err, rows) {
		console.log(rows);
	});
});

//Ausgewähltes Event löschen
app.post('/deletethis', function(req, res){
	const sql = `DELETE FROM users_events WHERE user_id=(${req.session.user}) AND events_id=(${req.body["deletethis"]})`;

	db.run(sql, function(err) {
		if (err){
			console.log(err.message);
		} else {
				console.log("Event gelöscht")
				res.redirect('/home');
		}
	});
});

// Alle Events löschen
app.post('/delete', function(req, res){
	const sql = `DELETE FROM users_events`;

	db.run(sql, function(err) {
		if (err){
			console.log(err.message);
		} else {
				console.log("Tabelle gelöscht")
				res.redirect('/home');
		}
	});
})

// Interessen abspeichern nach registrieren
app.post('/erste_schritte', function(req, res) {
	const { interesse } = req.body;
	interesse.forEach(interest_id => {
		db.run(`INSERT INTO users_interests(user_id,interests_id) VALUES(?, ?)`, [req.session.user, parseInt(interest_id, 10)], function(err) {
			 if (err) {
					console.log(err.message);
					throw "Cannot write user-interests to Database";
			 }
	 	});
 	});
	res.redirect('/home');
});

	//=======================================//
//Called when a URL is called that is not implemented
app.use((request, response, next) => {
	response.status(404).render('error');
});

// für interessen anzeigen:
// SELECT * FROM users_interests WHERE user_id = req.session.user
