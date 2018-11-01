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
