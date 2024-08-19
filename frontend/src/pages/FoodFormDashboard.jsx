import { useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from '../components/Spinner'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import FoodForm from '../components/FoodForm'


function FoodFormDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { foods, isLoading, isError, message } = useSelector(
    (state) => state.foods
  )

  useEffect(() => {

    if (isError) {
      console.log(message)
    }

    if (!user) {
      navigate('/login')
    }

  }, [user, navigate, isError, message, dispatch, foods])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <Container style={{marginTop: "80px"}}>
        <Row>
          <Col>
            <section className='heading'>
              <h1>Welcome {user && user.name}</h1>
            </section>

            <FoodForm/>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default FoodFormDashboard