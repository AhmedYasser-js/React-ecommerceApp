import React, { useContext, useEffect, useState } from "react";
import { cartContext } from "../../Context/CartContext.jsx";
import toast from "react-hot-toast";
import { RingLoader } from "react-spinners";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

export default function Cart() {
  const [cartDetails, setCartDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let { getLoggedUserCart, updateCartItems, deleteCartItem } = useContext(cartContext);

  async function getCartItems() {
    setIsLoading(true);
    try {
      let response = await getLoggedUserCart();
      setCartDetails(response?.data.data);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateCartCount(productId, count) {
    if (count < 1) return;
    setIsLoading(true);
    try {
      const response = await updateCartItems(productId, count);
      if (response?.data?.status === "success") {
        setCartDetails(response.data.data);
        toast.success("Quantity updated ✅", { position: "top-center" });
      } else {
        toast.error("Failed to update ❌", { position: "top-center" });
      }
    } catch {
      toast.error("Something went wrong ❌", { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  }

  async function removeCartItems(productId) {
    setIsLoading(true);
    try {
      const response = await deleteCartItem(productId);
      if (response?.data?.status === "success") {
        setCartDetails(response.data.data);
        toast.success("Item removed 🗑️", { position: "top-center" });
      } else {
        toast.error("Failed to delete ❌", { position: "top-center" });
      }
    } catch {
      toast.error("Something went wrong ❌", { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <RingLoader color="#22c55e" size={100} />
        </div>
      )}

      <h1 className="text-4xl text-center font-bold text-green-600 mb-6">🛒 Your Cart</h1>
      <h2 className="text-lg mb-8 text-center font-medium">
        Total Price:{" "}
        <span className="text-green-600 font-bold text-xl">{cartDetails?.totalCartPrice} EGP</span>
      </h2>

      <div className="w-5/6 mx-auto overflow-x-auto shadow-lg rounded-xl bg-white">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs uppercase bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartDetails?.products.map((product) => (
              <tr
                key={product.product.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  <img
                    src={product.product.imageCover}
                    className="w-36 h-36 object-cover rounded-lg shadow-sm"
                    alt={product.product.title}
                  />
                </td>
                <td className="px-4 py-4 font-semibold text-gray-900">
                  {product.product.title}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateCartCount(product.product.id, product.count - 1)}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="font-semibold">{product.count}</span>
                    <button
                      onClick={() => updateCartCount(product.product.id, product.count + 1)}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4 font-semibold">
                  {product.price * product.count} EGP
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => removeCartItems(product.product.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium"
                  >
                    <FiTrash2 /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
