import { FaSignInAlt, FaSignOutAlt, FaUser, FaTelegram } from 'react-icons/fa'
import { useNavigate, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'



import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <>
    <Container fluid className="bg-body-tertiary" style={{position:"fixed", top:"0", height:'60px', zIndex: 999}}>
      <Navbar className='container' >
        <Navbar.Brand href='/' className='d-flex align-items-center'>
            <FaTelegram className="mr-1"/>
            Notify
          </Navbar.Brand>
          <Nav className="me-auto">
            {/* {user && (<NavLink style={{marginRight:'10px', textDecoration:"none"}} className="text-dark" activeclassname="active" to='/events'>Events</NavLink> )} 
            {user && (<NavLink style={{marginRight:'10px', textDecoration:"none"}} className="text-dark" activeclassname="active" to='/CalendarTest'>CalendarTest</NavLink> )}  */}
            {user && (<NavLink style={{marginRight:'10px', textDecoration:"none"}} className="text-dark" activeclassname="active" to='/foodformdashboard'>Add food</NavLink> )} 
            {user && (<NavLink style={{marginRight:'10px', textDecoration:"none"}} className="text-dark" activeclassname="active" to='/ocrboard'>OCR</NavLink> )}
            {user && (<NavLink style={{marginRight:'10px', textDecoration:"none"}} className="text-dark" activeclassname="active" to='/userbetanalysis'>UserBetAnalysis</NavLink> )}
            {/* {user && (<NavLink style={{marginRight:'10px', textDecoration:"none"}} className="text-dark" activeclassname="active" to='/events'>event</NavLink> )}  */}
          </Nav>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {user ? (
                <button className='btn' onClick={onLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              ) : (
                <>
                  <NavLink to='/login' style={{marginRight:'10px', textDecoration:"none"}} >
                    <FaSignInAlt /> Login
                  </NavLink>
                  <NavLink to='/register' style={{marginRight:'10px', textDecoration:"none"}}>
                    <FaUser /> Register
                  </NavLink>
                </>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
      </Navbar>
      
    </Container>
 
    </>
  )
}

export default Header
