const Input = ({
  labelName,
  inputType,
  inputRequired,
  value,
  inputName,
  inputChange,
}) => {
  return (
    <>
      <label htmlFor={inputName} className="subtitulo subtitulo-hover">
        {labelName}
      </label>
      <input
        className="texto input__geral"
        type={inputType}
        required={inputRequired}
        value={value || ""}
        id={inputName}
        onChange={inputChange}
      />
    </>
  );
};

export default Input;
