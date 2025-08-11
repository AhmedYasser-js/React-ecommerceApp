import React, { useContext, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useNavigationType } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext.jsx';

export default function GuestOnlyRoute({ children }) {
  const { userLogin, setUserLogin } = useContext(UserContext);
  const navigate = useNavigate();
  // const location = useLocation();
  const navigationType = useNavigationType(); // POP / PUSH / REPLACE

  useEffect(() => {
    if (userLogin && navigationType === 'POP') {
      // فقط لو المستخدم مسجل ودخل URL يدويًا
      Swal.fire({
        title: 'You are already logged in ✅',
        text: 'If you want to log in with a different account, please logout first.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '🚪 Logout',
        cancelButtonText: '🏠 Stay Here',
        reverseButtons: true,
        customClass: {
          confirmButton: 'bg-green-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-green-700 transition-all duration-200 focus:outline-none border-none',
          cancelButton: 'bg-gray-100 text-gray-700 font-medium px-5 py-2 rounded-md hover:bg-gray-200 transition-all duration-200 border border-gray-300',
          actions: 'space-x-4'
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('token');
          setUserLogin(null);
          navigate('/login');
        } else {
          navigate('/');
        }
      });
    }
  }, [userLogin, navigationType]);

  if (userLogin) {
    return null;
  }

  return children;
}
