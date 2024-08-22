import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'

// import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import AddEvent from './pages/AddEvent'
import EventDashboard from './pages/EventDashboard'
import CalendarTest from './pages/CalendarTest'
import FoodFormDashboard from './pages/FoodFormDashboard'
import OcrBoard from './pages/OcrBoard'
import UserBetAnalysis from './pages/UserBetAnalysis'

function App() {
  return (
    <>
      <Router>
        <div>

          <Header />
          <Routes>
            {/* <Route exact path='/' element={<Dashboard />} /> */}
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/register' element={<Register />} />
            <Route exact path='/' element={<AddEvent />} />
            <Route exact path='/events' element={<EventDashboard />} />
            {/* <Route exact path='/CalendarTest' element={<CalendarTest />} /> */}
            <Route exact path='/foodformdashboard' element={<FoodFormDashboard />} />
            <Route exact path='/ocrboard' element={<OcrBoard />} />
            <Route exact path='/UserBetAnalysis' element={<UserBetAnalysis />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
