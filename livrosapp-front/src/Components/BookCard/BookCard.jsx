import React from "react";
import "./BookCard.css";

const BookCard = ({ book, handleEdit, handleDelete }) => (
    <div className="book--card__container">
        <h2 className="titulo">{book.title}</h2>
        <p className="texto"> de</p>
        <h2>{book.author}</h2>
        <p>Gênero(s): {book.genre}</p>
        <p>Status: {book.status}</p>
        <div className="book--card__buttons">
            <button onClick={() => handleEdit(book.id)}>Editar</button>
            <button onClick={() => handleDelete(book.id)}>Excluir</button>
        </div>
    </div>
);

export default BookCard;
