import Styles from './RecentProducts.module.css';
import { Link } from 'react-router-dom';
import { RingLoader } from 'react-spinners';
import useProducts from '../../Hooks/useProducts.jsx';
import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { fetchWishlist, addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../../Store/Slices/wishlistSlice';

import { cartContext } from '../../Context/CartContext.jsx';
import toast from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function RecentProducts() {
  let { data, isLoading, isFetching, isError, error } = useProducts();
  let { addProductToCart } = useContext(cartContext);
  
  const dispatch = useDispatch();
  const { items: wishlistItems, loading: wishlistLoading } = useSelector((state) => state.wishlist);

  const [isAddingLoading, setIsAddingLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Create array of wishlist item IDs for easy checking
  const wishlistItemIds = wishlistItems.map(item => item._id);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
    
    // Fetch user wishlist on component mount
    if (localStorage.getItem('token')) {
      dispatch(fetchWishlist());
    }
  }, [dispatch]);

  async function addProduct(productId) {
    setIsAddingLoading(true);
    try {
      let response = await addProductToCart(productId);
      if (response?.data?.status === "success") {
        toast.success(response.data.message, { duration: 1000, position: 'top-center' });
      } else {
        toast.error(response.data.message, { duration: 1000, position: 'top-center' });
      }
    } catch {
      toast.error("Something went wrong!", { duration: 1000, position: 'top-center' });
    } finally {
      setIsAddingLoading(false);
    }
  }

  async function handleWishlistAction(productId) {
    try {
      if (wishlistItemIds.includes(productId)) {
        const resultAction = await dispatch(removeFromWishlist(productId));
        if (removeFromWishlist.fulfilled.match(resultAction)) {
          toast.success("Removed from wishlist", { duration: 1000, position: 'top-center' });
        }
      } else {
        const resultAction = await dispatch(addToWishlist(productId));
        if (addToWishlist.fulfilled.match(resultAction)) {
          toast.success("Added to wishlist", { duration: 1000, position: 'top-center' });
        }
      }
    } catch (error) {
      toast.error("Error updating wishlist", { duration: 1000, position: 'top-center' });
      console.error("Wishlist error:", error);
    }
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RingLoader color="#22c55e" size={100} />
      </div>
    );
  }

  if (isError) {
    return <h2 className="text-2xl font-bold mb-6">Error: {error.message}</h2>;
  }

  const filteredProducts = data?.data.data.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {isAddingLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <RingLoader color="#22c55e" size={100} />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl text-center font-bold text-green-600 mb-6">📦 All Products</h1>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="border border-gray-300 px-4 relative group bg-white rounded-lg shadow-md shadow-green-500 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="absolute top-10 left-0 right-0 flex justify-between px-3">
                <button
                  onClick={() => addProduct(product.id)}
                  className="bg-green-500 text-white font-semibold px-2 py-2 rounded-md hover:bg-green-700 transition-all duration-500 transform -translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <i className="fa-solid fa-cart-plus text-2xl"></i>
                </button>
                <button 
                  onClick={() => handleWishlistAction(product.id)}
                  disabled={wishlistLoading}
                  className="bg-green-500 text-white font-semibold px-2 py-2 rounded-md hover:bg-green-700 transition-all duration-500 transform translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  {wishlistItemIds.includes(product.id) ? (
                    <i className="fa-solid fa-heart text-2xl text-red-500"></i>
                  ) : (
                    <i className="fa-solid fa-heart text-2xl"></i>
                  )}
                </button>
              </div>

              <Link to={`/productDetails/${product.id}/${product.category?.name}`}>
                <img src={product.imageCover} alt={product.title} className="w-full" />
                <div className="p-5 flex flex-col items-center text-center">
                  <p className="text-green-600 text-sm font-medium">{product?.category?.name}</p>
                  <h3 className="text-gray-800 font-semibold text-sm truncate w-full">
                    {product.title.split(' ').slice(0, 3).join(' ')}...
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{product.price} EGP</p>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm mt-2">
                    <span>★</span>
                    <span>{product.ratingsAverage?.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}