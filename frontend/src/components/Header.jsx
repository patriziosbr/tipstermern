import { FaSignInAlt, FaSignOutAlt, FaUser, FaDollarSign } from 'react-icons/fa'
import { useNavigate, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import Container from 'react-bootstrap/Container';


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
            <FaDollarSign className="mr-1"/>
            Budget
          </Navbar.Brand>
          <Nav className="me-auto">
            {user && (<NavLink style={{marginRight:'10px', textDecoration:"none"}} className="text-dark" activeclassname="active" to='/notaSpese'>Nota Spese form</NavLink> )}
            {user && (<NavLink style={{marginRight:'10px', textDecoration:"none"}} className="text-dark" activeclassname="active" to='/DashboardNotaSpese'>Dashboard lista note</NavLink> )}
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
