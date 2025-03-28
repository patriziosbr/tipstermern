import { FaPlus } from 'react-icons/fa';
import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import NotaSpeseForm from '../components/NotaSpeseForm';

function SingleScheda({scheda}) {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    const handleClose = () => {
        setShow(false); // Reset Redux state when closing the modal
    };

    return (
        <>
            <div className='d-flex justify-content-between mb-4'>
                <h5 className='mb-0 align-self-center'>{scheda.titolo}</h5>
                <Button variant="link" className='d-flex align-items-center' onClick={handleShow}>
                    <FaPlus className="me-2"/>
                    Add nota spese
                </Button>
            </div>
            <div>
            {JSON.stringify(scheda.notaSpese)}
                {/*  TODO GET DELLA LISTA DELLE NOTE SPESE BASATE SULL LITA di ID  */}
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title><b>Crea Nota in {scheda.titolo}</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>            
                    <NotaSpeseForm onSuccess={handleClose} schedaId={scheda._id} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default SingleScheda