import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from '../components/Spinner'
import SingleEvent from '../components/SingleEvent'
import { getEvents, reset } from '../features/events/eventSlice'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function EventDashboard() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { events, isLoading, isError, message } = useSelector(
    (state) => state.events
  )

  useEffect(() => {
    if (isError) {
      console.log(message)
    }

    if (!user) {
      navigate('/login')
    }

    dispatch(getEvents())

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])

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
              <p>Event Dashboard</p>
            </section>

            <section className=''>
            {events ? events.map((event) => (
              <SingleEvent key={event._id} event={event}/>

            )):
              <h4> Non ci sono eventi </h4>
            }
            </section>

          </Col>
        </Row>
      </Container>

    </>
  )
}

export default EventDashboard
