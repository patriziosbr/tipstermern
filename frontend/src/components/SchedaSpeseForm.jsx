import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import { createSchedaSpese } from '../features/schedaSpese/schedaSpeseSlice'

function SchedaSpeseForm({onSuccess}) {

  const [formData, setFormData] = useState({
    titolo: '',
    inserimentoData: '',
    condivisoCon: []
  })
  
  const { titolo, inserimentoData, condivisoCon } = formData

  const dispatch = useDispatch()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!titolo) {
      toast.error('Please fill in all required fields')
    } else {
      const schedaSpeseFormData = {
        titolo,
        inserimentoData: inserimentoData || new Date().toISOString(),
        condivisoCon
      }

      dispatch(createSchedaSpese(schedaSpeseFormData))
      .unwrap()
      .then((response) => {
        toast.success("Nota spese creata con successo!");
        onSuccess(); 
      })
      .catch((error) => {
        console.error("Error Response:", error); // Debugging
        toast.error(error.message || "Errore nella creazione della nota spese");
      });
    }
  }

  return (    
    <Container>
      <Form className="mb-3" onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>titolo</Form.Label>
          <Form.Control
            type="text"
            id="titolo"
            name="titolo"
            value={titolo}
            placeholder="GENNAIO"
            onChange={onChange}
            required
          />
        </Form.Group>
        {/* <Form.Group className="mb-3">
          <Form.Label>Inserimento Data</Form.Label>
          <Form.Control
            type="date"
            id="inserimentoData"
            name="inserimentoData"
            value={inserimentoData}
            onChange={onChange}
          />
        </Form.Group> */}

        <Form.Group className="mb-3">
          <Form.Label>Condiviso con</Form.Label>
          <Form.Control
            type="text"
            id="condivisoCon"
            name="condivisoCon"
            value={condivisoCon}
            placeholder="Condiviso con"
            onChange={onChange}
          />
        </Form.Group>
        <Button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Submit
        </Button>
      </Form>
    </Container>
  )
}

export default SchedaSpeseForm