const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "persistence", "leitor.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Ativar verificação de chaves estrangeiras
    db.run("PRAGMA foreign_keys = ON");

    // Tabela Leitor
    db.run(`CREATE TABLE IF NOT EXISTS leitor (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    senha TEXT NOT NULL
  )`);

    // Tabela EstadoLeitura
    db.run(`CREATE TABLE IF NOT EXISTS estado_leitura (
    estado TEXT PRIMARY KEY NOT NULL
  )`);

    // Populando a tabela EstadoLeitura
    const estados = ["Lido", "Lendo", "Irei ler"];
    estados.forEach((estado) => {
        db.run(`INSERT OR IGNORE INTO estado_leitura (estado) VALUES (?)`, [
            estado,
        ]);
    });

    // Tabela Leitura
    db.run(`CREATE TABLE IF NOT EXISTS leitura (
    id INTEGER PRIMARY KEY,
    isbn TEXT NOT NULL,
    leitor_id INTEGER NOT NULL,
    estado TEXT NOT NULL,
    FOREIGN KEY (leitor_id) REFERENCES leitor(id),
    FOREIGN KEY (estado) REFERENCES estado_leitura(estado)
  )`);

    // Tabela Resenha
    db.run(`CREATE TABLE IF NOT EXISTS resenha (
    id INTEGER PRIMARY KEY,
    id_leitura INTEGER UNIQUE NOT NULL,
    nota INTEGER NOT NULL,
    comentario TEXT,
    FOREIGN KEY (id_leitura) REFERENCES leitura(id)
  )`);
});

module.exports = db;
