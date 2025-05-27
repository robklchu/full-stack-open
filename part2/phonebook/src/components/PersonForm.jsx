import Input from "./Input";
import SubmitButton from "./SubmitButton";

const PersonForm = ({
  submitHandler,
  changeNameHander,
  changeNumberHandler,
  name,
  number,
}) => (
  <form onSubmit={submitHandler}>
    <Input text="name:" handler={changeNameHander} value={name} />
    <Input text="number:" handler={changeNumberHandler} value={number} />
    <SubmitButton text="save" />
  </form>
);

export default PersonForm;
