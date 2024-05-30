require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();
const port = 3001;
const apiKey = process.env.API_KEY;

app.use(bodyParser.json());

// Middleware de autenticação para verificar a API_KEY
const authenticate = (req, res, next) => {
    const requestApiKey = req.headers["api_key"];
    if (requestApiKey && requestApiKey === apiKey) {
        next();
    } else {
        res.status(403).json({ error: "Acesso negado" });
    }
};

// CRUD para Leitor (todos os endpoints requerem autenticação)

// Criar novo leitor
app.post("/leitor", authenticate, (req, res) => {
    const { email, nome, senha } = req.body;
    db.run(
        `INSERT INTO leitor (email, nome, senha) VALUES (?, ?, ?)`,
        [email, nome, senha],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ leitor: { id: this.lastID, email, nome } });
        }
    );
});

// Listar todos os leitores
app.get("/leitores", authenticate, (req, res) => {
    db.all(`SELECT * FROM leitor`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ leitores: rows });
    });
});

// Obter leitor por ID
app.get("/leitor/:id", authenticate, (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM leitor WHERE id = ?`, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "Leitor não encontrado" });
            return;
        }
        res.json({ leitor: row });
    });
});

// Atualizar leitor por ID
app.put("/leitor/:id", authenticate, (req, res) => {
    const { id } = req.params;
    const { email, nome, senha } = req.body;
    db.run(
        `UPDATE leitor SET email = ?, nome = ?, senha = ? WHERE id = ?`,
        [email, nome, senha, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: "Leitor não encontrado" });
                return;
            }
            res.json({ leitor: { id, email, nome } });
        }
    );
});

// Deletar leitor por ID
app.delete("/leitor/:id", authenticate, (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM leitor WHERE id = ?`, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: "Leitor não encontrado" });
            return;
        }
        res.json({ message: "Leitor deletado" });
    });
});

// Placeholder para CRUD de Leitura e Resenha
// // CRUD para Leitura
// // CRUD para Resenha

app.listen(port, () => {
    console.log(`Leitor service listening at http://localhost:${port}`);
});
