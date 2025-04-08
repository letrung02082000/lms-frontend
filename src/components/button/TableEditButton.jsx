const { MdEdit } = require('react-icons/md');

const TableEditButton = (props) => {
  return (
    <div className='w-100 d-flex justify-content-center'>
      <button
        className='btn'
        onClick={() => {
          props?.clearErrors();
          props?.reset();
          props?.setSelectedRow(props.data);
          props?.setIsEditMode(true);
          props?.setShowModal(true);
        }}
      >
        <MdEdit />
      </button>
    </div>
  );
};

export default TableEditButton;
