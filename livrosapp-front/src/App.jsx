import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Components/Header/Header";
import BookForm from "./Components/BookForm/BookForm";
import BookList from "./Components/BookList/BookList";
import ModalEdit from "./Components/ModalEdit/Index.jsx";
import LoginModal from "./Components/Login/LoginModal.jsx";
import ModalDelete from "./Components/ModalDelete/ModalDelete.jsx";
import ModalReview from "./Components/ModalReview/ModalReview.jsx";

function App() {
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showReview, setShowReview] = useState(false);
    // const [form, setForm] = useState(formDefault);
    const [books, setBooks] = useState([]);
    const [bookSelected, setBookSelected] = useState({});
    const [leituraSelected, setLeituraSelected] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(true);
    const [listBooks, setListBooks] = useState([]);
    const [error, setError] = useState("");

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setShowDelete(false);
        setShowReview(false);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if (form.id) {
            setBooks(books.map((book) => (book.id === form.id ? form : book)));
        } else {
            const newBook = { ...form, id: Date.now().toString() };
            setBooks([...books, newBook]);
        }
        setForm(formDefault);
        handleClose();
    };

    const handleEdit = (livro, leitura) => {
        setShow(true);
        setBookSelected(livro);
        setLeituraSelected(leitura);
    };

    const handleDelete = (livro, leitura) => {
        setShowDelete(true);
        setBookSelected(livro);
        setLeituraSelected(leitura);
    };

    const handleReview = (livro, leitura) => {
        setShowReview(true);
        setBookSelected(livro);
        setLeituraSelected(leitura);
    };

    const handleLogin = (token) => {
        setIsLoggedIn(true);
        setLoginModalOpen(false);
        localStorage.setItem("token", token);
    };

    const listReading = async (e) => {
        try {
            let headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": true,
                "Access-Control-Allow-Credentials": true,
            };
            const response = await axios.get("http://127.0.0.1:3001/leituras", {
                headers: headers,
            });
            console.log(response.data);
            const listResponse = response.data.leituras;
            setListBooks(listResponse);
        } catch (error) {
            setError(
                "Erro ao fazer login. Verifique suas credenciais e tente novamente."
            );
            console.error("Erro:", error);
        }
    };

    return (
        <div className="App">
            {loginModalOpen && (
                <LoginModal
                    isOpen={loginModalOpen}
                    onClose={() => setLoginModalOpen(false)}
                    onSuccess={handleLogin}
                />
            )}
            {isLoggedIn && (
                <>
                    <Header />
                    <BookForm
                        handleSubmit={handleSubmit}
                        reloadingList={listReading}
                    />
                    {listBooks && (
                        <BookList
                            books={books}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            handleReview={handleReview}
                            bookList={listBooks}
                            listReading={listReading}
                        />
                    )}

                    <ModalEdit
                        show={show}
                        handleClose={handleClose}
                        livro={bookSelected}
                        leitura={leituraSelected}
                        reloadingList={listReading}
                    />

                    <ModalDelete
                        show={showDelete}
                        handleClose={handleClose}
                        livro={bookSelected}
                        leitura={leituraSelected}
                        reloadingList={listReading}
                    />

                    <ModalReview
                        show={showReview}
                        handleClose={handleClose}
                        livro={bookSelected}
                        leitura={leituraSelected}
                        reloadingList={listReading}
                    />
                </>
            )}
        </div>
    );
}

export default App;
