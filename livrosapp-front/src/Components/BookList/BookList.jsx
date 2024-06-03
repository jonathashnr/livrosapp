import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./BookList.css";
import BookCard from "../BookCard/BookCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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

    if (bookList == null) return null;
    return (
        <div>
            <Row>
                <Col md={4}>
                    <h2>Leituras</h2>
                </Col>
            </Row>
            <Row xs={1} md={2} lg={4} className="g-4">
                {bookList &&
                    bookList.map((item, idx) => (
                        <Col key={idx}>
                            <BookCard
                                key={item.id}
                                book={item}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                handleReview={handleReview}
                            />
                        </Col>
                    ))}
            </Row>
        </div>
    );
};

export default BookList;
