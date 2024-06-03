import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";

const ModalDelete = ({ show, handleClose, livro, leitura, reloadingList }) => {
    useEffect(() => {}, [livro, leitura]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": true,
                "Access-Control-Allow-Credentials": true,
            };
            const response = await axios.delete(
                `http://127.0.0.1:3001/leitura/${leitura.id}`,
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
                    <Modal.Title>Excluir</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <p>Você deseja excluir a leitura {livro.titulo}</p>
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

export default ModalDelete;
