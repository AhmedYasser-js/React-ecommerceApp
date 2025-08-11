// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import About from './components/About/About';
import Login from './components/Login/Login';
import Cart from './components/Cart/Cart';
import Register from './components/Register/Register';
import Products from './components/Products/Products';
import Categories from './components/Categories/Categories';
import Notfound from './components/NotFound/Notfound';
import Brands from './components/Brands/Brands';
import CounterContextProvider from './Context/CounterContext.jsx';
import UserContextProvider from './Context/UserContext.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import GuestOnlyRoute from './components/GuestOnlyRoute/GuestOnlyRoute.jsx';
import ProductDetails from './components/productDetails/productDetails.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import CartContextProvider from './Context/CartContext.jsx';
import { Toaster } from 'react-hot-toast';
// import WishlistContextProvider from './Context/WishlistContext.jsx';
import Wishlist from './components/Wishlist/Wishlist.jsx';

import { Provider } from 'react-redux';
import { store } from './Store/store';



let query = new QueryClient();

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '', element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: 'about', element: <ProtectedRoute><About /></ProtectedRoute> },
      { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
      { path: 'products', element: <ProtectedRoute><Products /></ProtectedRoute> },
      { path: 'productDetails/:id/:category', element: <ProtectedRoute><ProductDetails /></ProtectedRoute> },
      { path: 'categories', element: <ProtectedRoute><Categories /></ProtectedRoute> },
      { path: 'brands', element: <ProtectedRoute><Brands /></ProtectedRoute> },
      { path: 'wishlist', element: <ProtectedRoute><Wishlist /></ProtectedRoute> },

      { path: 'login', element: <GuestOnlyRoute><Login /></GuestOnlyRoute> },
      { path: 'register', element: <GuestOnlyRoute><Register /></GuestOnlyRoute> },

      { path: '*', element: <Notfound /> },
    ],
  },
]);

function App() {
   return (
    <Provider store={store}>
      <QueryClientProvider client={query}>
        <UserContextProvider>
          <CounterContextProvider>
            <CartContextProvider>
              <RouterProvider router={router} />
              <ReactQueryDevtools />
              <Toaster />
            </CartContextProvider>
          </CounterContextProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </Provider>
  );
}
export default App;
