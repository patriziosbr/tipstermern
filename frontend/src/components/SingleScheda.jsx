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

    const parseDate = (dateString) => { 
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, '0'); 
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
        const year = date.getUTCFullYear();
        const formattedDate = `${day} ${month} ${year}`;
        return formattedDate
    }  
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
                <table>
                    {scheda.notaSpese.length > 0 ? (
                        <>
                            <thead>
                                <tr>
                                    <th>Titolo</th>
                                    <th>Importo</th>
                                    <th>Data Inserimento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scheda.notaSpese.map((notaSpesa) => (
                                    notaSpesa && (
                                        <tr key={notaSpesa._id}>
                                            <td>{notaSpesa.testo}</td>
                                            <td>{notaSpesa.importo}</td>
                                            <td>{parseDate(notaSpesa.inserimentoData)}</td>
                                        </tr>
                                    )
                                ))}
                            </tbody>
                        </>
                    ) : (
                        <thead>
                            <tr>
                                <td colSpan="3">Nessuna nota spese presente</td>
                            </tr>
                        </thead>
                    )}
            </table>
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