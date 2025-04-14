import { Edit, Trash } from "react-feather";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteCountry } from "../../services/actions/CountryAction";

const MySwal = withReactContent(Swal);

const Actions = ({ row }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const editRecord = () => navigate(`/countries/update/${row._id}`);

  const destroyRecord = async () => {
    const confirm = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
      },
      buttonsStyling: false,
    });

    if (confirm.isConfirmed) {
      dispatch(deleteCountry(row._id));
      navigate(`/countries`);
    }
  };

  return (
    <>
      <Edit
        size={18}
        className="pointer text-primary ms-1"
        onClick={editRecord}
      />
      <Trash
        size={18}
        className="pointer text-danger ms-1"
        onClick={destroyRecord}
      />
    </>
  );
};

export default Actions;
