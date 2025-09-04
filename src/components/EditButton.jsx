import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { FaEdit } from "react-icons/fa";

function EditButton({ path }) {
  const navigate = useNavigate();

  return (
    <div>
      <Button
        type="edit"
        onClick={(e) => {
          e.preventDefault();
          navigate(path);
        }}
      >
        <FaEdit /> Edit
      </Button>
    </div>
  );
}

export default EditButton;
