import React, { useState, useRef, useEffect } from "react";
import { searchFilter } from "./Filter";
import axios from "axios";
import "./SearchInput.css";

const DropdownItems = ({ onChange }) => {
    const [visible, setVisible] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const dropdownRef = useRef(null);
    const [list, setList] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        listBooks();
        document.addEventListener("mousedown", handleClick, false);
        return () =>
            document.removeEventListener("mousedown", handleClick, false);
    }, []);

    const handleClick = (e) => {
        if (dropdownRef.current.contains(e.target)) {
            return;
        }
        setVisible(false);
    };

    const handleChange = (e) => {
        setSearchValue(e.target.value);
        if (!visible) {
            setVisible(true);
        }
    };

    const selectItem = (item) => {
        setSearchValue(item.titulo);
        onChange(item.isbn);
        setSelectedItem(item.isbn);
        setVisible(false);
    };

    const selectChange = (e) => {
        console.log(e.target.value);
    };

    const listBooks = async (e) => {
        try {
            let headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": true,
                "Access-Control-Allow-Credentials": true,
            };
            const response = await axios.get("http://127.0.0.1:3000/livros", {
                headers: headers,
            });
            console.log(response.data);
            const listResponse = response.data.livros;
            setList(listResponse);
        } catch (error) {
            setError(
                "Erro ao fazer login. Verifique suas credenciais e tente novamente."
            );
            console.error("Erro:", error);
        }
    };

    return (
        <div className="container">
            <div tabIndex="0" className="input_container">
                <input
                    className="input"
                    type="text"
                    placeholder="Buscar livro"
                    value={searchValue}
                    onChange={handleChange}
                    onFocus={() => {
                        // if (searchValue) {
                        setVisible(true);
                        // };
                    }}
                />
            </div>
            <div ref={dropdownRef} className={`dropdown ${visible ? "v" : ""}`}>
                {visible && (
                    <ul>
                        {!list && (
                            <li key="zxc" className="dropdown_item">
                                sem resultados
                            </li>
                        )}
                        {list &&
                            searchFilter(searchValue, list).map((x) => (
                                <li
                                    key={x.isbn}
                                    onClick={() => selectItem(x)}
                                    className="dropdown_item"
                                >
                                    <div className="item_text1">{x.titulo}</div>
                                    <div className="item_text2">{x.autor}</div>
                                </li>
                            ))}
                    </ul>
                )}
            </div>
            {/* <select onChange={selectChange}>
                <option value="seb">sebouh</option>
                <option value="arm">arman</option>
            </select> */}
        </div>
    );
};

export default DropdownItems;
