const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('meetyourcity.db');

// Drop Users if exists
db.exec('DROP TABLE IF EXISTS users');

// Create Users Table
db.exec('CREATE TABLE users(email text, password text, username text, wohnort text)');


db.close();
