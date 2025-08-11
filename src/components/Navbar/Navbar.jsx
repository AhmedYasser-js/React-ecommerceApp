// src/components/Navbar/Navbar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWishlist } from '../../Store/Slices/wishlistSlice';
import Swal from 'sweetalert2';
import logo from '../../assets/images/logo.svg';
import { CounterContext } from '../../Context/CounterContext.jsx';
import { UserContext } from '../../Context/UserContext.jsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const { userLogin, setUserLogin } = useContext(UserContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get wishlist count from Redux store
  const wishlistCount = useSelector((state) => state.wishlist.count);

  // Fetch wishlist count when user logs in or when component mounts
  useEffect(() => {
    if (userLogin && localStorage.getItem('token')) {
      dispatch(fetchWishlist());
    }
  }, [userLogin, dispatch]);

  function logOut() {
    Swal.fire({
      title: 'Are you sure you want to log out? 🤔',
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
      }
    });
  }

  return (
    <nav className='bg-gray-100 fixed top-0 left-0 right-0 py-3 shadow-sm z-50 transition-all duration-500 ease-in-out'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center'>
          {/* Logo */}
          <img width={110} src={logo} alt="Fresh cart logo" />

          {/* Toggle Button */}
          <button
            className="lg:hidden focus:outline-none ml-4 transition-transform duration-300"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <div className="w-6 h-6 relative flex flex-col justify-center items-center">
              <span
                className={`absolute h-0.5 w-6 bg-gray-900 transform transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1.5'
                  }`}
              ></span>
              <span
                className={`absolute h-0.5 w-6 bg-gray-900 transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'
                  }`}
              ></span>
              <span
                className={`absolute h-0.5 w-6 bg-gray-900 transform transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1.5'
                  }`}
              ></span>
            </div>
          </button>

          {/* Navigation (Desktop) */}
          <div className='hidden lg:flex items-center justify-between w-full ml-10'>
            {/* Links */}
            <ul className='flex items-center '>
              {
                userLogin ?
                <>
                  {[
                    { to: "/", text: "Home" },
                    { to: "cart", text: "Cart" },
                    { to: "products", text: "Products" },
                    { to: "brands", text: "Brands" },
                    { to: "categories", text: "Categories" },
                    { to: "wishlist", text: "Wishlist", badge: wishlistCount },
                  ].map((item) => (
                    <li key={item.text} className="relative">
                      <NavLink
                        className={({ isActive }) =>
                          `py-2 p-4 text-lg ${isActive ? 'bg-blue-50 text-green-600 font-medium border rounded-md' : 'text-gray-900 font-light hover:bg-white hover:text-green-600 hover:rounded-md'} hover:text-green-500 transition-colors`
                        }
                        to={item.to}
                      >
                        {item.text}
                        {item.badge > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </> : null
              }
            </ul>

            {/* Auth + Social */}
            <div className='flex items-center space-x-6'>
              <ul className='flex items-center space-x-6'>
                {
                  !userLogin ?
                  <>
                    <li>
                      <NavLink
                        className={({ isActive }) =>
                          `py-2 text-lg ${isActive ? 'text-green-600 font-medium' : 'text-gray-900 font-light'} hover:text-green-500 transition-colors`
                        }
                        to="login"
                      >
                        Login
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className={({ isActive }) =>
                          `py-2 text-lg ${isActive ? 'text-green-600 font-medium' : 'text-gray-900 font-light'} hover:text-green-500 transition-colors`
                        }
                        to="register"
                      >
                        Register
                      </NavLink>
                    </li>
                  </> : null
                }
                {
                  userLogin ?
                  <>
                  <li>
                  <button onClick={logOut} className='py-2 text-lg text-gray-900 font-light hover:text-green-500 transition-colors'>
                    Logout
                  </button>
                </li>
                  </>: null
                }
              </ul>

              {/* Social Media Icons */}
              <div className='flex items-center space-x-4'>
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className='text-gray-700 hover:text-green-500 transition-colors'
                    aria-label={social}
                  >
                    <i className={`fab fa-${social} text-lg`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[600px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'
            }`}
        >
          <div className='pt-4 pb-2 flex flex-col items-center'>
            <ul className='space-y-2 w-1/3 text-center'>
              {
                userLogin ?
                <>
                  {[
                    { to: "/", text: "Home" },
                    { to: "cart", text: "Cart" },
                    { to: "products", text: "Products" },
                    { to: "brands", text: "Brands" },
                    { to: "categories", text: "Categories" },
                    { to: "wishlist", text: "Wishlist", badge: wishlistCount },
                  ].map((item) => (
                    <li key={item.text} className="relative">
                      <NavLink
                        className={({ isActive }) =>
                          `block py-3 px-4 rounded-lg text-lg transition-all duration-200 ${isActive
                            ? 'bg-blue-50 text-green-600 font-medium border'
                            : 'text-gray-900 font-light hover:bg-white hover:text-green-600'
                          }`
                        }
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.text}
                        {item.badge > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </> : null
              }

              {
                !userLogin ?
                <>
                  {[
                    { to: "login", text: "Login" },
                    { to: "register", text: "Register" },
                  ].map((item) => (
                    <li key={item.text}>
                      <NavLink
                        className={({ isActive }) =>
                          `block py-3 px-4 rounded-lg text-lg transition-all duration-200 ${isActive
                            ? 'bg-blue-50 text-green-600 font-medium border'
                            : 'text-gray-900 font-light hover:bg-white hover:text-green-600'
                          }`
                        }
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.text}
                      </NavLink>
                    </li>
                  ))}
                </> : null
              }

              {userLogin ?
              <>
              <li>
                <button
                  className='block py-3 px-4 rounded-lg text-lg text-gray-900 font-light hover:bg-gray-200 w-full'
                  onClick={logOut}
                >
                  Logout
                </button>
              </li>
              </> : null
              }

            </ul>

            {/* Mobile Social Media */}
            <div className='flex justify-center space-x-6 mt-4 pt-4 border-t border-gray-200 w-full'>
              {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className='text-gray-700 hover:text-green-500 transition-colors'
                  aria-label={social}
                >
                  <i className={`fab fa-${social} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}