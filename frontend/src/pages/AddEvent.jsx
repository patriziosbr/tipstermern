import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ScheduledEventForm from '../components/ScheduledEventForm'
import Spinner from '../components/Spinner'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { events, isLoading, isError, message } = useSelector(
    (state) => state.events
  )

  useEffect(() => {
    // console.log(events); ??? undefinde

    if (isError) {
      console.log(message)
    }

    if (!user) {
      navigate('/login')
    }

  }, [user, navigate, isError, message, dispatch, events])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <Container style={{marginTop: "80px"}}>
        <Row>
          <Col>
            <section className='heading'>
              <h1>Welcome {user && user.name} in usee </h1> 
            </section>

            <ScheduledEventForm/>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Dashboard
