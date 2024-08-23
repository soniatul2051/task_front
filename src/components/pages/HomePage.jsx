import { useState, useEffect } from 'react';
import { useCurrentUser } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { baseUrl } from '../../constraint';
const HomePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const navigate = useNavigate()

//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/api/v1/users/', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             // Include authorization headers if needed
//             // 'Authorization': `Bearer ${yourToken}`
//           }
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch user info');
//         }

//         const data = await response.json();
//         setUserInfo(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserInfo();
//   }, []);
const {currentUser, logoutCurrentUser, setCurrentUser} = useCurrentUser();

const handleDelete = async () => {
    const accessToken = Cookies.get('accessToken');
    try {
      const response = await fetch(`${baseUrl}/users/delete`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization headers if needed
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const result = await response.json();
      setDeleteMessage(result.message || 'User deleted successfully');
    //   setUserInfo(null); // Clear user info after deletion
    setCurrentUser(null);
    navigate('/register');
    } catch (error) {
      setDeleteMessage(error.message);
    }

  };
useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      
    }
    setUserInfo(currentUser);
  }, [currentUser]);

  

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">User Info</h1>
        {currentUser ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700">Email</h2>
              <p className="text-gray-600">{currentUser.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700">Username</h2>
              <p className="text-gray-600">{currentUser.username}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700">Full Name</h2>
              <p className="text-gray-600">{currentUser.fullname}</p>
            </div>
            <div>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
              {deleteMessage && (
                <p className="mt-4 text-center text-sm text-red-500">{deleteMessage}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">No user information available</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
