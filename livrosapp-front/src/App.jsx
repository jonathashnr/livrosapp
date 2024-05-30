import "./App.css";
import { useState } from "react";
import Header from "./Components/Header/Header";
import BookForm from "./Components/BookForm/BookForm";
import BookList from "./Components/BookList/BookList";
import Modal from "./Components/Modal/Index.jsx";
import LoginModal from "./Components/Login/LoginModal.jsx";

const formDefault = {
    id: "",
    title: "",
    author: "",
    genre: "",
    status: "",
};

function App() {
    const [show, setShow] = useState(false);
    const [form, setForm] = useState(formDefault);
    const [books, setBooks] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(true);

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setForm(formDefault);
        setShow(false);
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

    const handleEdit = (id) => {
        const book = books.find((b) => b.id === id);
        setForm(book);
        handleShow();
    };

    const handleDelete = (id) => {
        setBooks(books.filter((b) => b.id !== id));
    };

    const handleLogin = (token) => {
        setIsLoggedIn(true);
        setLoginModalOpen(false);
        localStorage.setItem("token", token);
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
                        form={form}
                        setForm={setForm}
                        handleSubmit={handleSubmit}
                    />
                    <BookList
                        books={books}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                    />
                    {show && (
                        <Modal show={show} handleClose={handleClose}>
                            <BookForm
                                form={form}
                                setForm={setForm}
                                handleSubmit={handleSubmit}
                            />
                        </Modal>
                    )}
                </>
            )}
        </div>
    );
}

export default App;
