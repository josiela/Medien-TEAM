const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('meetyourcity.db');

// Drop Users if exists
db.exec('DROP TABLE IF EXISTS users');
db.exec('DROP TABLE IF EXISTS pictures');
db.exec('DROP TABLE IF EXISTS events');
db.exec('DROP TABLE IF EXISTS interests');
db.exec('DROP TABLE IF EXISTS users_interests')
db.exec('DROP TABLE IF EXISTS users_events');

// Create Users Table
db.exec('CREATE TABLE users(id INTEGER PRIMARY KEY, email text, password text, username text, wohnort text, info text)');

// Create pictures Table
db.exec('CREATE TABLE pictures(document_id INTEGER PRIMARY KEY, mime_type TEXT NOT NULL, doc BLOB)');

// Create events Table
db.exec('CREATE TABLE events(id INTEGER PRIMARY KEY AUTOINCREMENT, eventname text, eventlocation text, date DATETIME, time TIME, eventinfo text, eventtag text)');

// Create interessen Table
db.exec('CREATE TABLE interests(id INTEGER PRIMARY KEY, title TEXT NOT NULL)');
db.run(`INSERT INTO interests(title) VALUES ("theater")`);
db.run(`INSERT INTO interests(title) VALUES ("musik")`);
db.run(`INSERT INTO interests(title) VALUES ("party")`);
db.run(`INSERT INTO interests(title) VALUES ("sport")`);

//
db.exec('CREATE TABLE users_interests(id INTEGER PRIMARY KEY, user_id INTEGER, interests_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(interests_id) REFERENCES interests(id))');

db.exec('CREATE TABLE users_events(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, events_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(events_id) REFERENCES events(id))');

db.close();
