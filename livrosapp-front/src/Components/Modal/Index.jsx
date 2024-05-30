import React from "react";
import "./Styles.css";

const Modal = ({ show, handleClose, children }) => {
    if (!show) return null;
    return (
        <div className="modal">
            <div className="modal-content">
                <div className="button-div">
                    <button className="close" onClick={handleClose}>
                        X
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
