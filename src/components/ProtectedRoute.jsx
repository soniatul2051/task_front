import React from 'react'
import { useCurrentUser } from '../context/userContext'
import { useNavigate } from 'react-router-dom'

function ProtectedRoute({element}) {
    const {currentUser} = useCurrentUser();
    const navigate = useNavigate();
    if(currentUser){
      navigate('/');
      return;
    }
  return (
    element
  )
}

export default ProtectedRoute
