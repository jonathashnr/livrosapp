import React, { useState } from "react";
import axios from "axios";
// import "./BookForm.css";
import SearchInput from "../Search/SearchInput";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CardFooter from "react-bootstrap/esm/CardFooter";

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
        <Row className="p-5">
            <form onSubmit={handleSubmit}>
                <Card border="light" className="mb-2">
                    <Card.Header>Adicione sua leitura</Card.Header>
                    <Card.Body>
                        <SearchInput onChange={handleChangeBook} />
                        <Form.Select
                            size="lg"
                            value={status}
                            required
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="" className="texto">
                                Selecione o status da leitura
                            </option>

                            <option value="Lendo" className="texto">
                                Lendo
                            </option>
                            <option value="Lido" className="texto">
                                Lido
                            </option>
                            <option value="Irei ler" className="texto">
                                Vou Ler
                            </option>
                        </Form.Select>
                    </Card.Body>
                    <CardFooter>
                        <Button value="submit" type="submit" variant="primary">
                            Adicionar Leitura
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Row>
    );
};

export default BookForm;
