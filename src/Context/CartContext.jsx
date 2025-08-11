//  src/Context/CartContext.jsx
    import axios from "axios";
    import { createContext } from "react";

    export let cartContext = createContext();
    export default function CartContextProvider({ children }) {
        let headers = {};
        if (localStorage.getItem('token')) {
            headers = {
                token: localStorage.getItem('token')
            }
        }
        function getLoggedUserCart() {
            return axios.get('https://ecommerce.routemisr.com/api/v1/cart', {
                headers
            })
                .then((res) => {
                    console.log(res);
                    return res
                })
                .catch((err) => {
                    console.log(err);
                    return err
                })
        }

        function deleteCartItem(id) {
            return axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${id}`, {
                headers
            })
                .then((res) => {
                    console.log(res);
                    return res
                })
                .catch((err) => {
                    console.log(err);
                    return err
                })
        }

        function addProductToCart(productId) {
            return axios.post('https://ecommerce.routemisr.com/api/v1/cart', {
                productId
            }, {
                headers
            })
                .then((res) => {
                    console.log(res);
                    return res
                })
                .catch((err) => {
                    console.log(err);
                    return err
                })
        }

            function updateCartItems(productId,count) {
            return axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
                count
            }, {
                headers
            })
                .then((res) => {
                    console.log(res);
                    return res
                })
                .catch((err) => {
                    console.log(err);
                    return err
                })
        }

        return (
            <cartContext.Provider value={{deleteCartItem, getLoggedUserCart , addProductToCart , updateCartItems}}>
                {children}
            </cartContext.Provider>
        );
    }
