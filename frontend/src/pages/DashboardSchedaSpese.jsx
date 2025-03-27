import { FaPlus } from 'react-icons/fa';
import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux'
import SchedaSpeseForm from '../components/SchedaSpeseForm'

function DashboardSchedaSpese() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
        <SchedaSpeseForm/>
      </Modal.Body>
    </Modal>
    </>

  )
}

export default DashboardSchedaSpese