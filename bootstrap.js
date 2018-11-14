const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('meetyourcity.db');

// Drop Users if exists
db.exec('DROP TABLE IF EXISTS users');

// Create Users Table
db.exec('CREATE TABLE users(email text, password text, username text, wohnort text, info text)');

// Create pictures Table
db.exec('CREATE TABLE pictures(document_id INTEGER PRIMARY KEY, mime_type TEXT NOT NULL, doc BLOB);')

db.close();
