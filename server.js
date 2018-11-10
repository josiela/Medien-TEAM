//Initialisiere Datenbanken
const sqlite3 = require('sqlite3').verbose();
let db1 = new sqlite3.Database('users.db');
let db2 = new sqlite3.Database('events.db');

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

app.get('/start-login', function(req, res) {
  res.render('start-login');
});

app.get('/erste_schritte', function(req, res) {
  res.render('erste_schritte');
});


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
app.get('/registrierung', function(req, res) {
  res.render('registrierung');
});

app.get('/start-login', function(req, res) {
  res.render('start-login');
});
app.get('/veranstaltung_unterseite', function(req, res) {
  res.render('veranstaltung_unterseite');
});
