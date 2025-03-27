import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

import Container from 'react-bootstrap/Container';

import NotaSpeseForm from '../components/NotaSpeseForm'

function NotaSpese() {


  return (
    <>
      <h3>Create Nota Spese</h3>
      <NotaSpeseForm/>
    </>
  )
}

export default NotaSpese
