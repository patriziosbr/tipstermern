import { useState, useEffect } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import { createEvent, updateEvent } from '../features/events/eventSlice'

function EventForm() {

  const [formData, setfromData] = useState({
    emailReciever: "",
    startAt: "",
    endAt: "",
    hourStart: "",
    hourEnd:"",
    title: "",
    bodyEvent:""
  })
  const {emailReciever, startAt, endAt, hourStart, hourEnd, title, bodyEvent} = formData;
  const dispatch = useDispatch()
  const [text, setText] = useState('Ciao, la tua prenotazione è confermata per il giorno alle ore ');

  const onChange = (e) => {
    setfromData((prevState)=> ({
        ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  useEffect(() => {
    const updatedText = `Ciao ${formData.emailReciever}, 
      la tua prenotazione è confermata per il giorno ${formData.startAt} alle ore ${formData.hourStart}`;
    setText(updatedText);
  }, [formData]);

 

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

    //Empty form after send form
    setfromData({
      emailReciever: "",
      startAt: "",
      endAt: "",
      hourStart: "",
      hourEnd: "",
      title: "",
      bodyEvent: "",
      template: ""
    })
  }

//da vedere se si puo spostare in un componente
  const event = {
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
DTSTART:${formatDate(new Date(event.startTime))}
DTEND:${formatDate(new Date(event.endTime))}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
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
      toast.success(message)
      // console.log(message)
    }
    );
  }
//da vedere se si puo spostare in un componente

  return (
    <>
      <Container>
        <Row>
          <Col>
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
                  <Form.Control type="time" name="hourStart" value={hourStart} onChange={onChange}/>
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

              <p>{text}</p>

  
              <Button variant="primary" type="submit" style={{width:"100%"}}>
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default EventForm