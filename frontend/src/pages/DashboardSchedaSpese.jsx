import React from "react";
import { FaPlus } from 'react-icons/fa';
import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SchedaSpeseForm from '../components/SchedaSpeseForm';
import SchedaSpese from '../components/SchedaSpese';


function DashboardSchedaSpese() {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false); // Reset Redux state when closing the modal
  };

  // const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  //   <a
  //     href=""
  //     ref={ref}
  //     onClick={e => {
  //       e.preventDefault();
  //       onClick(e);
  //     }}
  //   >
  //     {children}
  //     <span className="threedots" />
  //   </a>
  // ));

  return (
    <>
      <div className='d-flex justify-content-between mb-4'>
        <h2 className='mb-0 align-self-center'>Dashboard note spese</h2>

        <Button variant="secondary" className='d-flex align-items-center' onClick={handleShow}>
          <FaPlus className="me-2"/>
          Scheda
        </Button>
      </div>

      <SchedaSpese/>
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><b>Crea scheda</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>            
          <SchedaSpeseForm onSuccess={handleClose} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DashboardSchedaSpese