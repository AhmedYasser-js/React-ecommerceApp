//. src/Context/UserContext.jsx

import { useState, createContext, useEffect } from "react";

// إنشاء الـ Context
export const UserContext = createContext();

// كومبوننت الـ Provider
export default function UserContextProvider({ children }) {
  const [userLogin, setUserLogin] = useState(null);

  useEffect(
    () => {
      if (localStorage.getItem('token')) {
        setUserLogin(localStorage.getItem('token'));
      }
    }, [])

  return (
    <UserContext.Provider value={{ userLogin, setUserLogin }}>
      {children}
    </UserContext.Provider>
  );
}
