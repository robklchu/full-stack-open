const Input = ({ text, handler, value }) => (
  <div>
    {text} <input onChange={handler} value={value} />
  </div>
);

export default Input;
