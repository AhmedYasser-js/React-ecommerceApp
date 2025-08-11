 // src/Context/WishlistContext.jsx
import axios from "axios";
import { createContext } from "react";

export let wishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
    let headers = {};
    if (localStorage.getItem("token")) {
        headers = {
            token: localStorage.getItem("token"),
        };
    }

    // ✅ Get logged user wishlist
    function getLoggedUserWishlist() {
        return axios
            .get("https://ecommerce.routemisr.com/api/v1/wishlist", { headers })
            .then((res) => {
                console.log("Wishlist:", res);
                return res;
            })
            .catch((err) => {
                console.error("Error fetching wishlist:", err);
                return err;
            });
    }

    // ✅ Add product to wishlist
    function addProductToWishlist(productId) {
        return axios
            .post(
                "https://ecommerce.routemisr.com/api/v1/wishlist",
                { productId },
                { headers }
            )
            .then((res) => {
                console.log("Added to wishlist:", res);
                return res;
            })
            .catch((err) => {
                console.error("Error adding to wishlist:", err);
                return err;
            });
    }

    // ✅ Remove product from wishlist
    function removeProductFromWishlist(productId) {
        return axios
            .delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers }
            )
            .then((res) => {
                console.log("Removed from wishlist:", res);
                return res;
            })
            .catch((err) => {
                console.error("Error removing from wishlist:", err);
                return err;
            });
    }

    return (
        <wishlistContext.Provider
            value={{
                getLoggedUserWishlist,
                addProductToWishlist,
                removeProductFromWishlist,
            }}
        >
            {children}
        </wishlistContext.Provider>
    );
}
