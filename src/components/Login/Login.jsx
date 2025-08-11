import React, { useContext, useEffect, useState } from 'react';
import Style from './Login.module.css';
import { useFormik } from 'formik';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { UserContext } from '../../Context/UserContext.jsx';

export default function Login() {

  let {setUserLogin , userLogin} = useContext(UserContext);


  let validationSchema = Yup.object({
    email: Yup.string().email('Invalid Email').required('Email is Required'),
    password: Yup.string().matches(/^[A-Z][a-z0-9]{6,10}$/, "Password must start with uppercase and contain 6 to 10 letters").required('Password is Required'),
  });
  let navigate = useNavigate();
  const [togglePassword, setTogglePassword] = useState(true);
  function togglePass() {
    setTogglePassword(!togglePassword);
  }


  // async function handleLogin(formValues) {
  //   let { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup', formValues);
  //   if (data.message === 'success') {
  //     navigate('/'); // أو ممكن تستخدم window.location.href
  //   }
  //   console.log(formValues);
  // }
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false)
  function handleLogin(formValues) {
    setLoading(true);
    axios.post('https://ecommerce.routemisr.com/api/v1/auth/signin', formValues).then((res) => {
      if (res.data.message === 'success') {
      setLoading(false);
        localStorage.setItem('token', res.data.token);
        setUserLogin(res.data.token);
        navigate('/');
      }
    }).catch((err) => {
      setLoading(false);
      setApiError(err?.response?.data?.message);
    });
  }

  let formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: handleLogin
  });



  return (
    <>
      <div className='text-start py-6 max-w-xl mx-auto'>
        {apiError && <div className="p-4 mb-2 mt-5 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          <span className="font-medium">{apiError}</span>
        </div>}
        <h1 className='text-3xl font-bold py-5 text-green-600'>Login Now</h1>

        <form onSubmit={formik.handleSubmit}>


          {/* ✅ حقل الإيميل */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              id="email"
              name="email"
              type="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
            />
            <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-green-600">Enter your email address</label>
            {
              formik.errors.email && formik.touched.email &&
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                <span className="font-medium">{formik.errors.email}</span>
              </div>
            }
          </div>

          {/* ✅ حقل الباسورد */}
          <div className="relative z-0 w-full mb-5 group">
            <div className="relative">
              <input
                id="password"
                name="password"
                type={togglePassword ? "password" : "text"}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                className="block py-2.5 pr-10 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
              />
              <i
                onClick={togglePass}
                className={`absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 cursor-pointer text-sm ${togglePassword ? 'fa fa-eye-slash' : 'fa fa-eye'}`}
              ></i>
              <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:text-green-600">Enter your password</label>
            </div>
            {
              formik.errors.password && formik.touched.password &&
              <div className="p-3 mt-1 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                <span className="font-medium">{formik.errors.password}</span>
              </div>
            }
          </div>

          {/* ✅ زر الإرسال */}
          <div className='flex items-center gap-5' >
            <button
            type="submit"
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading && <i className='fa fa-spinner animate-spin' ></i>}
            {!loading && "Login"}
          </button>
          <p>Don't have an account? <Link to="/register" className='text-green-600'>Register Now</Link></p>
          </div>
        </form>
      </div>
    </>
  );
}
