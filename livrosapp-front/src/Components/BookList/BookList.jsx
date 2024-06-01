import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./BookList.css";
import BookCard from "../BookCard/BookCard";

const BookList = ({
    books,
    handleEdit,
    handleDelete,
    handleReview,
    bookList,
    listReading,
}) => {
    const [list, setList] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        setList(bookList);
        listReading();
    }, []);

    return (
        <div className="books__container">
            {bookList &&
                bookList.map((item) => (
                    <BookCard
                        key={item.id}
                        book={item}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleReview={handleReview}
                    />
                ))}
        </div>
    );
};

export default BookList;
