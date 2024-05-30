const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();
app.use(cors());
const port = 3000;

app.use(bodyParser.json());

// Função de validação de ISBN-13
function isValidISBN13(isbn) {
    return typeof isbn === "string" && isbn.length === 13 && /^\d+$/.test(isbn);
}

app.get("/livros", (req, res) => {
    db.all("SELECT * FROM livros", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ livros: rows });
    });
});

app.get("/livros/:isbn", (req, res) => {
    const { isbn } = req.params;
    if (!isValidISBN13(isbn)) {
        res.status(400).json({ error: "ISBN-13 inválido" });
        return;
    }
    db.get("SELECT * FROM livros WHERE isbn = ?", [isbn], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "Livro não encontrado" });
            return;
        }
        res.json({ livro: row });
    });
});

app.post("/livros", (req, res) => {
    const { isbn, titulo, autor, ano, url_capa, descricao } = req.body;
    if (!isValidISBN13(isbn)) {
        res.status(400).json({ error: "ISBN-13 inválido" });
        return;
    }
    db.run(
        "INSERT INTO livros (isbn, titulo, autor, ano, url_capa, descricao) VALUES (?, ?, ?, ?, ?, ?)",
        [isbn, titulo, autor, ano, url_capa, descricao],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                livro: { isbn, titulo, autor, ano, url_capa, descricao },
            });
        }
    );
});

app.put("/livros/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { titulo, autor, ano, url_capa, descricao } = req.body;
    if (!isValidISBN13(isbn)) {
        res.status(400).json({ error: "ISBN-13 inválido" });
        return;
    }
    db.run(
        "UPDATE livros SET titulo = ?, autor = ?, ano = ?, url_capa = ?, descricao = ? WHERE isbn = ?",
        [titulo, autor, ano, url_capa, descricao, isbn],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: "Livro não encontrado" });
                return;
            }
            res.json({
                livro: { isbn, titulo, autor, ano, url_capa, descricao },
            });
        }
    );
});

app.delete("/livros/:isbn", (req, res) => {
    const { isbn } = req.params;
    if (!isValidISBN13(isbn)) {
        res.status(400).json({ error: "ISBN-13 inválido" });
        return;
    }
    db.run("DELETE FROM livros WHERE isbn = ?", [isbn], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "Livro não encontrado" });
            return;
        }
        res.json({ message: "Livro deletado" });
    });
});

app.listen(port, () => {
    console.log(`Livros service listening at http://localhost:${port}`);
});
