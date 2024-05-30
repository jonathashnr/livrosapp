const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "livros.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS livros (
    isbn TEXT PRIMARY KEY, 
    titulo TEXT, 
    autor TEXT, 
    ano INTEGER, 
    url_capa TEXT, 
    descricao TEXT
  )`);
});

module.exports = db;
