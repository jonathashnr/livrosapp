require("dotenv").config();
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const app = express();
app.use(cors());
const port = 3001;
const apiKey = process.env.API_KEY;
const jwtSecret = process.env.JWT_SECRET;

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

// Middleware de autenticação para verificar JWT
const authenticateJwt = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Token inválido" });
        }
        req.leitor_id = decoded.id; // Adiciona o leitor_id ao request
        next();
    });
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

// CRUD para Leitura e Resenha
// Adicionar nova leitura
app.post("/leitura", authenticateJwt, async (req, res) => {
    const { isbn, estado } = req.body;

    try {
        // Verificar se o livro é válido
        const livroResponse = await axios.get(
            `http://localhost:3000/livros/${isbn}`
        );
        if (livroResponse.status !== 200) {
            return res.status(400).json({ error: "Livro não encontrado" });
        }

        // Inserir nova leitura no banco de dados
        db.run(
            `INSERT INTO leitura (isbn, leitor_id, estado) VALUES (?, ?, ?)`,
            [isbn, req.leitor_id, estado],
            function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({
                    leitura: {
                        id: this.lastID,
                        isbn,
                        leitor_id: req.leitor_id,
                        estado,
                    },
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Erro ao verificar o livro" });
    }
});

// Obter leitura por ID
app.get("/leitura/:id", authenticateJwt, (req, res) => {
    const { id } = req.params;
    db.get(
        `SELECT leitura.*, resenha.nota, resenha.comentario 
          FROM leitura 
          LEFT JOIN resenha ON leitura.id = resenha.id_leitura 
          WHERE leitura.id = ? AND leitura.leitor_id = ?`,
        [id, req.leitor_id],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!row) {
                res.status(404).json({ error: "Leitura não encontrada" });
                return;
            }
            const leitura = {
                id: row.id,
                isbn: row.isbn,
                leitor_id: row.leitor_id,
                estado: row.estado,
                resenha: row.nota
                    ? { nota: row.nota, comentario: row.comentario }
                    : null,
            };
            res.json({ leitura });
        }
    );
});

app.put("/leitura/:id", authenticateJwt, (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    db.get(
        `SELECT * FROM leitura WHERE id = ? AND leitor_id = ?`,
        [id, req.leitor_id],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!row) {
                res.status(403).json({ error: "Acesso negado" });
                return;
            }
            db.run(
                `UPDATE leitura SET estado = ? WHERE id = ?`,
                [estado, id],
                function (err) {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    if (this.changes === 0) {
                        res.status(404).json({
                            error: "Leitura não encontrada",
                        });
                        return;
                    }
                    res.json({ leitura: { id, estado } });
                }
            );
        }
    );
});

// Obter todas as leituras de um usuário
app.get("/leituras", authenticateJwt, (req, res) => {
    db.all(
        `SELECT leitura.*, resenha.nota, resenha.comentario 
          FROM leitura 
          LEFT JOIN resenha ON leitura.id = resenha.id_leitura 
          WHERE leitura.leitor_id = ?`,
        [req.leitor_id],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            const leituras = rows.map((row) => ({
                id: row.id,
                isbn: row.isbn,
                leitor_id: row.leitor_id,
                estado: row.estado,
                resenha: row.nota
                    ? { nota: row.nota, comentario: row.comentario }
                    : null,
            }));
            res.json({ leituras });
        }
    );
});

// Deletar leitura por ID (e resenha relacionada)
app.delete("/leitura/:id", authenticateJwt, (req, res) => {
    const { id } = req.params;
    db.run(
        `DELETE FROM resenha WHERE id_leitura = (SELECT id FROM leitura WHERE id = ? AND leitor_id = ?)`,
        [id, req.leitor_id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            db.run(
                `DELETE FROM leitura WHERE id = ? AND leitor_id = ?`,
                [id, req.leitor_id],
                function (err) {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    if (this.changes === 0) {
                        res.status(404).json({
                            error: "Leitura não encontrada",
                        });
                        return;
                    }
                    res.json({ message: "Leitura deletada" });
                }
            );
        }
    );
});

// Criar nova resenha
app.post("/resenha", authenticateJwt, (req, res) => {
    const { id_leitura, nota, comentario } = req.body;
    db.get(
        `SELECT * FROM leitura WHERE id = ? AND leitor_id = ?`,
        [id_leitura, req.leitor_id],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!row) {
                res.status(403).json({ error: "Acesso negado" });
                return;
            }
            db.run(
                `INSERT INTO resenha (id_leitura, nota, comentario) VALUES (?, ?, ?)`,
                [id_leitura, nota, comentario],
                function (err) {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    res.json({ resenha: { id_leitura, nota, comentario } });
                }
            );
        }
    );
});

// Atualizar resenha por ID da leitura
app.put("/resenha/:id_leitura", authenticateJwt, (req, res) => {
    const { id_leitura } = req.params;
    const { nota, comentario } = req.body;
    db.get(
        `SELECT * FROM leitura WHERE id = ? AND leitor_id = ?`,
        [id_leitura, req.leitor_id],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!row) {
                res.status(403).json({ error: "Acesso negado" });
                return;
            }
            db.run(
                `UPDATE resenha SET nota = ?, comentario = ? WHERE id_leitura = ?`,
                [nota, comentario, id_leitura],
                function (err) {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    if (this.changes === 0) {
                        res.status(404).json({
                            error: "Resenha não encontrada",
                        });
                        return;
                    }
                    res.json({ resenha: { id_leitura, nota, comentario } });
                }
            );
        }
    );
});

// Deletar resenha por ID da leitura
app.delete("/resenha/:id_leitura", authenticateJwt, (req, res) => {
    const { id_leitura } = req.params;
    db.get(
        `SELECT * FROM leitura WHERE id = ? AND leitor_id = ?`,
        [id_leitura, req.leitor_id],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!row) {
                res.status(403).json({ error: "Acesso negado" });
                return;
            }
            db.run(
                `DELETE FROM resenha WHERE id_leitura = ?`,
                [id_leitura],
                function (err) {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    if (this.changes === 0) {
                        res.status(404).json({
                            error: "Resenha não encontrada",
                        });
                        return;
                    }
                    res.json({ message: "Resenha deletada" });
                }
            );
        }
    );
});

app.listen(port, () => {
    console.log(`Leitor service listening at http://localhost:${port}`);
});
