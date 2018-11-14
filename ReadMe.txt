Notwendige Installationen für die Funktion:

Node.js und Sqlite müssen vorliegen.
Node.js hier: https://nodejs.org/de/download/
Sqlite hier: https://www.sqlite.org/download.html
-> Bei Sqlite den dritten Link unter "Precompiled Binaries for Windows" auswählen
Anleitung zur Installation von Sqlite: http://www.sqlitetutorial.net/download-install-sqlite/


Befehle für die Konsole, um alle wichtigen Pakete für die Web-App im Ordner zu installieren:

Möglicherweise vorher npm init um eine eigene package.json anzulegen, falls die mitgedownloadete Version nicht funktioniert/vorliegt. Dabei nicht vergessen in die package.json noch die nötigen Änderungen zu schreiben um die Verwendung von nodemon möglich zu machen. Der Bereich "scripts" in der package.json sollte dann so aussehen:

"scripts": {
    
	"test": "echo \"Error: no test specified\" && exit 1",
    
	"start": "node server.js",
    
	"dev": "nodemon server.js"
  },


Hier die weiteren Konsolenbefehle:

npm install
npm install express --save
npm install body-parser --save
npm install ejs --save
npm install nodemon --save-dev
npm install sqlite3 --save
npm install bcrypt --save
npm install express-session --save

node ./bootstrap vor dem Starten der server.js (Muss nur ein einziges Mal ausgeführt werden)
