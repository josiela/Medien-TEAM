Notwendige Installationen f�r die Funktion:

Node.js und Sqlite m�ssen vorliegen.
Node.js hier: https://nodejs.org/de/download/
Sqlite hier: https://www.sqlite.org/download.html
-> Bei Sqlite den dritten Link unter "Precompiled Binaries for Windows" ausw�hlen
Anleitung zur Installation von Sqlite: http://www.sqlitetutorial.net/download-install-sqlite/


Befehle f�r die Konsole, um alle wichtigen Pakete f�r die Web-App im Ordner zu installieren:

M�glicherweise vorher npm init um eine eigene package.json anzulegen, falls die mitgedownloadete Version nicht funktioniert/vorliegt. Dabei nicht vergessen in die package.json noch die n�tigen �nderungen zu schreiben um die Verwendung von nodemon m�glich zu machen. Der Bereich "scripts" in der package.json sollte dann so aussehen:

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