import React, { useState } from "react";
import axios from "axios";
import "../Login/LoginModal.css"; // Ajuste o caminho conforme necessário

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": true,
                "Access-Control-Allow-Credentials": true,
            };
            const response = await axios.post(
                "http://127.0.0.1:3002/login",
                {
                    email: email,
                    senha: password,
                },
                {
                    headers: headers,
                }
            );
            console.log(response.data);
            const token = response.data.token;
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            console.log("Usuário logado com sucesso!");
            onSuccess();
        } catch (error) {
            setError(
                "Erro ao fazer login. Verifique suas credenciais e tente novamente."
            );
            console.error("Erro:", error);
        }
    };

    return (
        <div className={`modal ${isOpen ? "show" : ""}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <h2 className="titulo">Login Usuário</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form__container">
                        <input
                            className="input__geral"
                            type="text"
                            placeholder="E-mail"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="input__geral"
                            type="password"
                            placeholder="Senha"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="btn__geral" type="submit">
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
