import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./BookCard.css";

const BookCard = ({ book, handleEdit, handleDelete, handleReview }) => {
    const [livro, setLivro] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const getBookByIsbn = async (e) => {
        try {
            setLoading(true);
            let headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": true,
                "Access-Control-Allow-Credentials": true,
            };
            const response = await axios.get(
                `http://127.0.0.1:3000/livros/${book.isbn}`,
                {
                    headers: headers,
                }
            );
            console.log(response.data);
            const bookResponse = response.data.livro;
            setLivro(bookResponse);
        } catch (error) {
            setError(
                "Erro ao fazer login. Verifique suas credenciais e tente novamente."
            );
            console.error("Erro:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getBookByIsbn();
    }, []);

    return (
        <div className="book--card__container">
            {!loading && (
                <div>
                    <h2 className="titulo">{livro.titulo}</h2>
                    <p className="texto"> de</p>
                    <h2>{livro.autor}</h2>
                    <p>Status: {book.estado}</p>
                    <div className="book--card__buttons">
                        <button onClick={() => handleEdit(livro, book)}>
                            Editar
                        </button>
                        <button onClick={() => handleDelete(livro, book)}>
                            Excluir
                        </button>
                    </div>
                    <div>
                        <button onClick={() => handleReview(livro, book)}>
                            Adicionar resenha
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookCard;
