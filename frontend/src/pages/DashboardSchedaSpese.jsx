import { FaPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SchedaSpeseForm from '../components/SchedaSpeseForm';
import { reset } from "../features/schedaSpese/schedaSpeseSlice";

function DashboardSchedaSpese() {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const { isSuccess } = useSelector((state) => state.schedaSpese);

  const handleClose = () => {
    setShow(false);
    dispatch(reset()); // Reset Redux state when closing the modal
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    if (isSuccess) {
      handleClose(); // Close modal on success
    }
  }, [isSuccess]);

  return (
    <>
      <div className='d-flex justify-content-between'>
        <h3>Dashboard note spese</h3>
        <Button variant="secondary" className='d-flex align-items-center' onClick={handleShow}>
          <FaPlus className="me-2"/>
          Nota spese
        </Button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><b>Crea Nota</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>            
          <SchedaSpeseForm onSuccess={handleClose} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DashboardSchedaSpese