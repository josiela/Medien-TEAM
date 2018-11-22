const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('meetyourcity.db');

// Drop Users if exists
db.exec('DROP TABLE IF EXISTS users');
db.exec('DROP TABLE IF EXISTS pictures');
db.exec('DROP TABLE IF EXISTS events');
db.exec('DROP TABLE IF EXISTS interessen');

// Create Users Table
db.exec('CREATE TABLE users(email text, password text, username text, wohnort text, info text)');

// Create pictures Table
db.exec('CREATE TABLE pictures(document_id INTEGER PRIMARY KEY, mime_type TEXT NOT NULL, doc BLOB);')

// Create events Table
db.exec('CREATE TABLE events(eventname text, eventlocation text, date DATETIME, time TIME, eventinfo text)');

// Create interessen TABLE
db.exec('CREATE TABLE interessen(interesse text)');

db.close();
