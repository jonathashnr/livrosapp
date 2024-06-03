require("dotenv").config();
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const app = express();
app.use(cors());
const port = 3002; // Porta para o microserviço de autenticação
const jwtSecret = process.env.JWT_SECRET; // Adicione sua chave secreta JWT no .env

app.use(bodyParser.json());

// Rota para criação de usuário
app.post("/register", async (req, res) => {
    const { email, nome, senha } = req.body;

    try {
        // Gerar o hash da senha
        const saltRounds = 10;
        const hashedSenha = await bcrypt.hash(senha, saltRounds);

        // Criar novo leitor
        const response = await axios.post(
            "http://localhost:3001/leitor",
            {
                email,
                nome,
                senha: hashedSenha,
            },
            {
                headers: {
                    api_key: process.env.API_KEY,
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
});

// Rota para login de usuário
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Obter o leitor pelo email
        const response = await axios.get(`http://localhost:3001/leitores`, {
            headers: {
                api_key: process.env.API_KEY,
            },
        });

        const leitor = response.data.leitores.find(
            (leitor) => leitor.email === email
        );

        if (!leitor) {
            return res.status(401).json({ error: "Email ou senha inválidos" });
        }

        // Verificar a senha
        const validPassword = await bcrypt.compare(senha, leitor.senha);

        if (!validPassword) {
            return res.status(401).json({ error: "Email ou senha inválidos" });
        }

        // Gerar o token JWT
        const token = jwt.sign({ id: leitor.id }, jwtSecret, {
            expiresIn: "1h",
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Erro ao fazer login" });
    }
});

app.listen(port, () => {
    console.log(`Auth service listening at http://localhost:${port}`);
});
