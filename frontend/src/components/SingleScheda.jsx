import { FaPlus } from 'react-icons/fa';
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegTimesCircle } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";

import { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import NotaSpeseForm from '../components/NotaSpeseForm';
import Table from 'react-bootstrap/Table';
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import useLongPress from "./utils/useLongPress.js";
import { useDispatch } from 'react-redux'
import { getSchedaSpese, updateSchedaSpese } from '../features/schedaSpese/schedaSpeseSlice'


function SingleScheda({scheda}) {
    // const [show, setShow] = useState(false);
    // const [showUser, setShowUser] = useState(false);
    // const handleShow = (param) => param === "showUser" ? setShowUser(true) : setShow(true);
    // const handleClose = () => {
    //     setShow(false); // Reset Redux state when closing the modal
    // };

    const [modalState, setModalState] = useState({
        showCreaNotaModal: false,
        showShareModal: false,
    });

    const handleShow = (param) => {
        setModalState((prevState) => ({
            ...prevState,
            [param === "showShare" ? "showShareModal" : "showCreaNotaModal"]: true,
        }));
    };
    
    const handleClose = (param) => {
        setModalState((prevState) => ({
            ...prevState,
            [param === "hideShare" ? "showShareModal" : "showCreaNotaModal"]: false,
        }));
    };

    const [longPressCount, setlongPressCount] = useState(0)
    const [formData, setFormData] = useState({
    titolo: scheda.titolo,
    })
    
    const { titolo } = formData

    const dispatch = useDispatch()

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
          href=""
          ref={ref}
          onClick={e => {
            e.preventDefault();
            onClick(e);
          }}
        >
          {children}
          <span className="threedots" />
        </a>
      ));
      
      const onLongPress = () => {
        setlongPressCount(longPressCount + 1)
      };

      const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
      };
      const longPressEvent = useLongPress(onLongPress, defaultOptions);

      const updateSchedataTitolo = async () => {
        const updatePayload = { titolo: titolo };
        
        await dispatch(updateSchedaSpese({ schedaId: scheda._id, ...updatePayload })).unwrap();
        await dispatch(getSchedaSpese()).unwrap();
      }
    
      const parseDate = (dateString) => { 
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, '0'); 
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
        const year = date.getUTCFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate
    }  


    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                {longPressCount < 1 && <h5 role="button" className='mb-0 align-self-center'  {...longPressEvent} >{scheda.titolo}</h5>}
                {longPressCount > 0 && 
                    <div>
                        <input name="titolo" type='text' value={titolo} onChange={onChange}/> 
                        <span className='mx-4'><FaRegCheckCircle size={30} onClick={()=> updateSchedataTitolo()}/></span>
                        <span><FaRegTimesCircle size={30} onClick={() => setlongPressCount(longPressCount - 1)} /></span>
                    </div>
                    }
                <Dropdown>
                <Dropdown.Toggle as={CustomToggle} />
                    <Dropdown.Menu size="sm" title="">
                    <Dropdown.Header>Options</Dropdown.Header>
                    <Dropdown.Item>
                    <span variant="secondary" className='d-flex align-items-center' onClick={()=>handleShow("")}>
                        <FaPlus className="me-2"/>Add nota spese
                    </span>
                    </Dropdown.Item>
                    <Dropdown.Item>
                    <span variant="secondary" className='d-flex align-items-center' onClick={()=>handleShow("showShare")}>
                        <FaUserPlus className="me-2"/>Condividi
                    </span>
                    </Dropdown.Item>
                    <Dropdown.Item>hnjm</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
            </div>
            <div>
                <Table striped className="mb-5">
                    {scheda.notaSpese.length > 0 ? (
                        <>
                            <thead>
                                <tr>
                                    <th>Titolo</th>
                                    <th>Data</th>
                                    <th>Importo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scheda.notaSpese.map((notaSpesa) => (
                                    notaSpesa.testo && (
                                        <tr key={notaSpesa._id}>
                                            <td>{notaSpesa.testo ? notaSpesa.testo : null}</td>
                                            <td>{parseDate(notaSpesa.inserimentoData)}</td>
                                            <td>{notaSpesa.importo}</td>
  
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
            </Table>
            </div>

            <Modal show={modalState.showCreaNotaModal} onHide={() => handleClose("")}>
                <Modal.Header closeButton>
                <Modal.Title><b>Crea Nota in {scheda.titolo}</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>            
                    <NotaSpeseForm onSuccess={handleClose} schedaId={scheda._id} />
                </Modal.Body>
            </Modal>
            <Modal show={modalState.showShareModal} onHide={() => handleClose("hideShare")}>
                <Modal.Header closeButton>
                <Modal.Title><b>Aggiungi utente in {scheda.titolo}</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>            
                    {/* TODO SINGLE SCHEDA CONDIVISA */}
                    {/* <NotaSpeseForm onSuccess={handleClose} schedaId={scheda._id} /> */}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default SingleScheda