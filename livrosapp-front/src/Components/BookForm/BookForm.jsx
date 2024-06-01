import React, { useState } from "react";
import axios from "axios";
import "./BookForm.css";
import SearchInput from "../Search/SearchInput";

const BookForm = ({ form, setForm, reloadingList }) => {
    const [isbn, setIsbn] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");

    const handleChangeBook = (value) => {
        setIsbn(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": true,
                "Access-Control-Allow-Credentials": true,
            };
            const response = await axios.post(
                "http://127.0.0.1:3001/leitura",
                {
                    isbn: isbn,
                    estado: status,
                },
                {
                    headers: headers,
                }
            );
            console.log(response.data);
        } catch (error) {
            setError(
                "Erro ao fazer login. Verifique suas credenciais e tente novamente."
            );
            console.error("Erro:", error);
        } finally {
            reloadingList();
            setIsbn("");
            setStatus("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <SearchInput onChange={handleChangeBook} />
            <select
                id="status"
                className="texto"
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="" className="texto"></option>
                <option value="Lendo" className="texto">
                    Lendo
                </option>
                <option value="Lido" className="texto">
                    Lido
                </option>
                <option value="Irei ler" className="texto">
                    Vou Ler
                </option>
            </select>
            <button type="submit">Adicionar Leitura</button>
        </form>
    );
};

export default BookForm;
