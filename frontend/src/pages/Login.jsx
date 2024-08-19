import { useState, useEffect } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {AiOutlineLock} from 'react-icons/ai'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate('/')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      email,
      password,
    }

    dispatch(login(userData))
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <Container>
        <section style={{marginTop:"80px"}}>
          <div style={{backgroundColor: "#f2f6ff",
            borderRadius: "50%",
            aspectRatio: "1",
            display: "flex",
            height: "90px",
            margin: "auto",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "15px"
          }}>
            <FaSignInAlt style={{fontSize:"60px", color:"#0d6efd" }}/>
          </div>
          <h1>Login</h1>
          <p>Login and start sending events</p>
        </section>
        <Form className="mb-3" onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" id='email' name="email" value={email} placeholder='Enter your email' onChange={onChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" id='password' name="password" value={password} placeholder='Enter password' onChange={onChange} />
          </Form.Group>
          <Button type="submit" className='btn btn-primary' style={{width:"100%"}}>
            Submit
          </Button>
        </Form>
      </Container>
    </>
  )
}

export default Login
