import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";

const ModalReview = ({ show, handleClose, livro, leitura, reloadingList }) => {
    const [nota, setNota] = useState(0);
    const [comentario, setComentario] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {}, [livro, leitura]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": true,
                "Access-Control-Allow-Credentials": true,
            };
            const response = await axios.post(
                `http://127.0.0.1:3001/resenha`,
                {
                    id_leitura: leitura.id,
                    nota: nota,
                    comentario: comentario,
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
            handleClose();
            setNota(0);
            setComentario("");
        }
    };

    if (!show) return null;
    return (
        <div className="modal show" style={{ display: "block" }}>
            <Modal.Dialog size="xl">
                <Modal.Header closeButton onHide={handleClose}>
                    <Modal.Title>Resenha</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row className="p-3">
                            <p>
                                Qual a nota para a leitura do livro{" "}
                                {livro.titulo}?
                            </p>
                            <Form.Label>Nota {nota}</Form.Label>
                            <Form.Range
                                defaultValue={0}
                                min={0}
                                max={10}
                                onChange={(e) => setNota(e.target.value)}
                                value={nota}
                            />
                        </Row>
                        <Row className="p-2">
                            <Form.Control
                                as="textarea"
                                placeholder="Sua opinião"
                                style={{ height: "100px" }}
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                            />
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" value="Submit" type="submit">
                            Confirmar
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            Voltar
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal.Dialog>
        </div>
    );
};

export default ModalReview;
