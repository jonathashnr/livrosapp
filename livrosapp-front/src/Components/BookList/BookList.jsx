import React from "react";
import "./BookList.css";
import BookCard from "../BookCard/BookCard";

const BookList = ({ books, handleEdit, handleDelete }) => (
    <div className="books__container">
        {books.map((book) => (
            <BookCard
                key={book.id}
                book={book}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        ))}
    </div>
);

export default BookList;
