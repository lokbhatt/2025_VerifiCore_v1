import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const useConfirmDialog = () => {
  const confirm = async ({ title, text, confirmText = "Yes", cancelText = "Cancel", icon = "warning" }) => {
    return await MySwal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
    });
  };

  return confirm;
};

export default useConfirmDialog;
