import React, { useState, useRef, useEffect } from "react";
// import "./Styles.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";

const ModalEdit = ({ show, handleClose, livro, leitura, reloadingList }) => {
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setStatus(leitura.estado);
    }, [livro, leitura]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": true,
                "Access-Control-Allow-Credentials": true,
            };
            const response = await axios.put(
                `http://127.0.0.1:3001/leitura/${leitura.id}`,
                {
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
            handleClose();
        }
    };

    if (!show) return null;
    return (
        <div className="modal show" style={{ display: "block" }}>
            <Modal.Dialog size="xl">
                <Modal.Header closeButton onHide={handleClose}>
                    <Modal.Title>{livro.titulo}</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Lendo">Lendo</option>
                            <option value="Lido">Lido</option>
                            <option value="Irei ler">Vou Ler</option>
                        </Form.Select>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit">Confirmar</button>
                    </Modal.Footer>
                </form>
            </Modal.Dialog>
        </div>
    );
};

export default ModalEdit;
