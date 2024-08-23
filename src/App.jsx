
import Register from './components/pages/Register'
import Login from './components/pages/Login'
import HomePage from './components/pages/HomePage'
import { BrowserRouter ,Route, Routes} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
function App() {
  return (
   
      <BrowserRouter>
     
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<ProtectedRoute element={<Login />}/>} />
          <Route path="/" element={<HomePage />} />
        </Routes>
     
      </BrowserRouter>
    
  )
}

export default App
