import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { RingLoader } from 'react-spinners';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../../Store/Slices/wishlistSlice';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  let { id, category } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const dispatch = useDispatch();
  const { items: wishlistItems, loading: wishlistLoading } = useSelector((state) => state.wishlist);
  
  // Create array of wishlist item IDs for easy checking
  const wishlistItemIds = wishlistItems.map(item => item._id);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
      .then((response) => {
        setProductDetails(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
        setLoading(false);
      });

    // Fetch wishlist when component mounts
    if (localStorage.getItem('token')) {
      dispatch(fetchWishlist());
    }
  }, [id, dispatch]);

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

  useEffect(() => {
    setLoading(true);
    axios
      .get('https://ecommerce.routemisr.com/api/v1/products')
      .then(({data}) => {
        let sameCategoryProducts = data.data.filter(product => product.category.name == category);
        setRelatedProducts(sameCategoryProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RingLoader color="#22c55e" size={100} />
      </div>
    );
  }

  return (
    <>
      {productDetails && (
        <div className="flex flex-col lg:flex-row items-center justify-evenly gap-6 p-4">
          <div className="w-full lg:w-1/2 max-w-md">
            {productDetails.images && (
              <Swiper navigation={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                modules={[Navigation, Autoplay]}
                className="mySwiper rounded-lg shadow-lg">
                {productDetails.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img src={img} alt={productDetails.title} className="w-full h-auto rounded-lg" />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{productDetails.title}</h2>
            <p className="text-lg text-gray-600 mb-2">{productDetails.description}</p>
            <p className="text-green-600 font-bold text-xl mb-4">{productDetails.price} EGP</p>
            <div className='flex gap-4'>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition w-100">
                <i className="fa-solid fa-cart-plus"></i> add to cart
              </button>
              <button 
                onClick={() => handleWishlistAction(productDetails.id)}
                disabled={wishlistLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition w-100"
              >
                <i className={`fa-solid fa-heart ${wishlistItemIds.includes(productDetails.id) ? 'text-red-600' : ''}`}></i> 
                {wishlistItemIds.includes(productDetails.id) ? ' remove from wishlist' : ' add to wishlist'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {relatedProducts.map((product) => (
              <Link key={product.id} to={`/productDetails/${product.id}/${product.category?.name}`}>
            <div className="relative group bg-white rounded-lg shadow-md shadow-green-500 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <img src={product.imageCover} alt={product.title} className="w-full" />
              <div className="absolute top-10 left-0 right-0 flex justify-between px-3">
                <button className="bg-green-600 text-white font-semibold px-2 py-2 rounded-md hover:bg-green-700 transition-all duration-500 transform -translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                  <i className="fa-solid fa-cart-plus text-2xl"></i>
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleWishlistAction(product.id);
                  }}
                  disabled={wishlistLoading}
                  className="bg-green-600 text-white font-semibold px-2 py-2 rounded-md hover:bg-green-700 transition-all duration-500 transform translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  {wishlistItemIds.includes(product.id) ? (
                    <i className="fa-solid fa-heart text-2xl text-red-600"></i>
                  ) : (
                    <i className="fa-solid fa-heart text-2xl"></i>
                  )}
                </button>
              </div>
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
            </div>
              </Link>

          ))}
        </div>
      </div>
    </>
  );
}