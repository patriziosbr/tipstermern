import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import { createNotaSpese } from '../features/notaSpese/notaSpeseSlice'
import { getSchedaSpese, updateSchedaSpese } from '../features/schedaSpese/schedaSpeseSlice'

function NotaSpeseForm({ onSuccess, schedaId }) {
  const [formData, setFormData] = useState({
    testo: '',
    inserimentoData: '',
    importo: '',
    categoria_id: [],
  })

  const { testo, inserimentoData, importo, categoria_id } = formData

  const dispatch = useDispatch()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!testo || !importo) {
      toast.error('Please fill in all required fields')
    } else {
      const categoriesArray = ['53cb6b9b4f4ddef1ad47f943', "53cb6b9b4f4ddef1ad47f911"];
      if(categoria_id.length > 0) categoriesArray.push(categoria_id);
      const notaSpeseData = {
        testo,
        inserimentoData: inserimentoData || new Date().toISOString(),
        importo: parseFloat(importo),
        categoria_id: categoriesArray ?? [],
      }

      fetchDispatch(notaSpeseData)
    }
  }

  const fetchDispatch = async (notaSpeseData) => {
    try {
      // Dispatch action to create a new nota spese
      const response = await dispatch(createNotaSpese(notaSpeseData)).unwrap();
  
      toast.success("Nota spese creata con successo!");
  
      // Update schedaSpese with new notaSpese
      const data = {
        notaSpeseData: response,
        schedaId: schedaId,
      };
      await dispatch(updateSchedaSpese(data)).unwrap();
      await dispatch(getSchedaSpese()).unwrap();
      
    } catch (error) {
      console.error("Error Response:", error);
      toast.error(error.message || "Errore nella creazione della nota spese");
    }
  };

  return (
    <Container>
      <Form className="mb-3" onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Testo</Form.Label>
          <Form.Control
            type="text"
            id="testo"
            name="testo"
            value={testo}
            placeholder="Enter text"
            onChange={onChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Inserimento Data</Form.Label>
          <Form.Control
            type="date"
            id="inserimentoData"
            name="inserimentoData"
            value={inserimentoData}
            onChange={onChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Importo</Form.Label>
          <Form.Control
            type="number"
            id="importo"
            name="importo"
            value={importo}
            placeholder="Enter amount"
            onChange={onChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categoria ID</Form.Label>
          <Form.Control
            type="text"
            id="categoria_id"
            name="categoria_id"
            value={categoria_id}
            placeholder="Enter category ID"
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

export default NotaSpeseForm