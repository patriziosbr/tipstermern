import Card from 'react-bootstrap/Card';
import { AiOutlineEdit } from 'react-icons/ai'
import { BsTrash } from 'react-icons/bs'

import { useState } from 'react'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useDispatch } from 'react-redux'
import { createEvent, updateEvent } from '../features/events/eventSlice'


function SingleEvent({event}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [formData, setfromData] = useState({
    emailReciever: event.emailReciever,
    startAt: event.startAt.split("/").map(item => item.padStart(2, '0')).reverse().join("-"),
    endAt: event.endAt.split("/").map(item => item.padStart(2, '0')).reverse().join("-"),
    hourStart: event.hourStart,
    hourEnd: event.hourEnd,
    title: event.title,
    bodyEvent:event.bodyEvent
  })
  const {emailReciever, startAt, endAt, hourStart, hourEnd, title, bodyEvent} = formData;
  const dispatch = useDispatch()

  const onChange = (e) => {
    setfromData((prevState)=> ({
        ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    let eventId;
    await dispatch(createEvent( formData )).then((result)=>{
      eventId = result.payload._id
    })

    const fileIcs = generateIcsFile();
    sendMail(fileIcs, emailReciever, title, bodyEvent)

    const data = {
      eventId,
      emailSent: true
    }
    // // Send mail completed, update emailSent field in the database
    await dispatch(updateEvent(data));

  }


  //da vedere se si puo spostare in un componente
  const dataEvent = {
    title: title,
    description: bodyEvent,
    startTime: `${startAt}T${hourStart}`,
    endTime: `${endAt}T${hourEnd}`,
    location: "Online"
  };


const generateIcsFile = () => {
const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//EN
BEGIN:VEVENT
UID:${generateUid()}@mycompany.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(new Date(dataEvent.startTime))}
DTEND:${formatDate(new Date(dataEvent.endTime))}
SUMMARY:${dataEvent.title}
DESCRIPTION:${dataEvent.description}
LOCATION:${dataEvent.location}
END:VEVENT
END:VCALENDAR`;

const base64Data = btoa(unescape(encodeURIComponent(icsContent)));
// console.log(base64Data);
return base64Data
};

const generateUid = () => {
// Generate a unique ID using any desired algorithm or library
// This is just a simple example
return Math.random().toString(36).substr(2, 9);
};

const formatDate = (date) => {
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
const seconds = String(date.getSeconds()).padStart(2, '0');

return `${year}${month}${day}T${hours}${minutes}${seconds}`;

};

  function sendMail(file, emailReciever, title, bodyEvent) {


    window.Email.send({
      SecureToken: "40e5bd95-02f3-458c-b6c2-9c1969a23e2a",
      To: emailReciever,
      From: "Notify Beta - tommasoversetto@gmail.com",
      Subject: title,
      Body: bodyEvent,
      Attachments: [
        {
          name: 'event.ics',
          data: file
        }
      ]
    }).then((message)=>{
      // toast.success(message)
      console.log(message)
    }
    );
  }
//da vedere se si puo spostare in un componente
  return (
    <>
      <Card className='mb-3'>

        <Card.Header style={{ textTransform: "capitalize"}} className="d-flex justify-content-between align-items-center">
          <b>{event.title}</b>
          <div className="d-flex">
            <div style={{ height: "40px", width: "40px" }} className='d-flex mr-2'>
              <AiOutlineEdit className='m-auto' onClick={handleShow}/>
            </div>
            <div style={{ height: "40px", width: "40px" }} className='d-flex mr-2'>
              <BsTrash className='m-auto'/>
            </div>
          </div>
        </Card.Header>

        <Card.Body>
          <blockquote className="blockquote mb-0">
            <p>
              {' '}
              {event.bodyEvent ? (event.bodyEvent) : ("") }
              {' '}
            </p>
            <footer className="blockquote-footer">
              Starts at {event.startAt} at {event.hourStart}
            </footer>
            <footer className="blockquote-footer">
              End at {event.endAt} at {event.hourEnd}
            </footer>
            {event.emailSent ? (<footer className="blockquote-footer">Sent: { event.emailReciever + ' ✔' }</footer>) :(<footer className="blockquote-footer">Sent: { event.emailReciever + ' ✘' }</footer>) }
            <footer className="blockquote-footer">
              Created at {event.createdAt}
            </footer>
          </blockquote>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><b>Modifica: {event.title}</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>            
          <Form className="mb-3" onSubmit={onSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="mail@mail.com" name="emailReciever" value={emailReciever} onChange={onChange} />
              </Form.Group>

              <div style={{display: "flex"}}>
                <Form.Group className="mb-3 me-2" controlId="formBasicEmail" style={{width:"50%"}}>
                  <Form.Label>Giorno Inizio evento</Form.Label>
                  <Form.Control type="date" placeholder="mail@mail.com" name="startAt" value={startAt} onChange={onChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail" style={{width:"50%"}}>
                  <Form.Label>Giorno Fine evento</Form.Label>
                  <Form.Control type="date" placeholder="mail@mail.com" name="endAt" value={endAt} onChange={onChange}/>
                </Form.Group>
              </div>
              <div style={{display: "flex"}}>
                <Form.Group className="mb-3 me-2" controlId="formBasicEmail" style={{width:"50%"}}>
                  <Form.Label>Ora Inizio evento</Form.Label>
                  <Form.Control type="time" name="hourStart" value={event.hourStart} onChange={onChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail" style={{width:"50%"}}>
                  <Form.Label>Ora Fine evento</Form.Label>
                  <Form.Control type="time" name="hourEnd" value={hourEnd} onChange={onChange}/>
                </Form.Group>
              </div>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Titolo</Form.Label>
                <Form.Control type="text" placeholder="Inserisci titolo" name="title" value={title} onChange={onChange}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Corpo email</Form.Label>
                <Form.Control as="textarea" rows={3} name="bodyEvent" value={bodyEvent} onChange={onChange}/>
              </Form.Group>

              <Button variant="primary" type="submit" style={{width:"100%"}}>
                Submit
              </Button>
            </Form>
            </Modal.Body>
      </Modal>

    </>

  );
}

export default SingleEvent;