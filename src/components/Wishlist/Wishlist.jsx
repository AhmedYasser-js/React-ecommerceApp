// src/components/Wishlist/Wishlist.jsx
import { RingLoader } from 'react-spinners';
import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { fetchWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import { fetchWishlist, removeFromWishlist } from '../../Store/Slices/wishlistSlice';

import { cartContext } from '../../Context/CartContext.jsx';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Wishlist() {
    const { addProductToCart } = useContext(cartContext);
    const dispatch = useDispatch();
    const { items: wishlistProducts, loading, error } = useSelector((state) => state.wishlist);

    const [removingId, setRemovingId] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [addingProductId, setAddingProductId] = useState(null);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
        });

        // Fetch wishlist when component mounts
        if (localStorage.getItem('token')) {
            dispatch(fetchWishlist());
        }
    }, [dispatch]);

    async function handleRemoveFromWishlist(productId) {
        setRemovingId(productId);
        try {
            const resultAction = await dispatch(removeFromWishlist(productId));
            if (removeFromWishlist.fulfilled.match(resultAction)) {
                toast.success("Removed from wishlist", { duration: 1000, position: 'top-center' });
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove item", { duration: 1000, position: 'top-center' });
        } finally {
            setRemovingId(null);
        }
    }

    async function handleAddToCart(productId) {
        setIsAddingToCart(true);
        setAddingProductId(productId);
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
            setIsAddingToCart(false);
            setAddingProductId(null);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <RingLoader color="#22c55e" size={100} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h2 className="text-2xl font-bold text-red-600">Error: {error}</h2>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl text-center font-bold text-green-600 mb-6">❤️ Your Wishlist</h1>

            {isAddingToCart && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <RingLoader color="#22c55e" size={100} />
                </div>
            )}

            {wishlistProducts.length === 0 ? (
                <div className="text-center py-12">
                    <i className="fa-regular fa-heart text-5xl text-gray-400 mb-4"></i>
                    <h2 className="text-xl font-semibold text-gray-600">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-4">Add products to your wishlist to see them here</p>
                    <Link
                        to="/"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg inline-block"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistProducts.map((product, index) => (
                        <div
                            key={product._id}
                            className="border border-gray-300 px-4 relative group bg-white rounded-lg shadow-md shadow-green-500 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="absolute top-[42.7px] right-3 z-10">
                                <button
                                    onClick={() => handleRemoveFromWishlist(product._id)}
                                    disabled={removingId === product._id}
                                    className="bg-red-600 text-white font-semibold px-2 py-2 rounded-md hover:bg-red-700 transition-all duration-500 transform translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                >
                                    {removingId === product._id ? (
                                        <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
                                    ) : (
                                        <i className="fa-solid fa-trash text-2xl"></i>
                                    )}
                                </button>
                            </div>

                            {/* Add to Cart Button - Similar to RecentProducts.jsx */}
                            <div className="absolute top-10 left-0 right-0 flex justify-between px-3">
                                <button
                                    onClick={() => handleAddToCart(product._id)}
                                    disabled={isAddingToCart && addingProductId === product._id}
                                    className="bg-green-600 text-white font-semibold px-2 py-2 rounded-md hover:bg-green-700 transition-all duration-500 transform -translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                >
                                    {isAddingToCart && addingProductId === product._id ? (
                                        <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
                                    ) : (
                                        <i className="fa-solid fa-cart-plus text-2xl"></i>
                                    )}
                                </button>
                            </div>

                            <Link to={`/productDetails/${product._id}/${product.category?.name}`} className="w-full">
                                <img
                                    src={product.imageCover}
                                    alt={product.title}
                                    className="w-[60%] object-cover mx-auto"
                                />
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
            )}
        </div>
    );
}