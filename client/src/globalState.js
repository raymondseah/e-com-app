/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect } from "react";
import ProductsAPI from "./components/APIs/productAPI";
import UserAPI from "./components/APIs/userAPI";
import CategoriesAPI from "./components/APIs/catergoryAPI";
import axios from "axios";

export const GlobalState = createContext();
export const DataProvider = ({ children }) => {
  // const [token, setToken] = useState(false)
  // useEffect(() =>{
  //     const firstLogin = localStorage.getItem('firstLogin')
  //     if(firstLogin){
  //         const refreshToken = async () =>{
  //             const res = await axios.get('/user/refresh_token')

  //             setToken(res.data.accesstoken)

  //             setTimeout(() => {
  //                 refreshToken()
  //             }, 10 * 60 * 1000)
  //         }
  //         refreshToken()
  //     }
  // },[])

  const state = {
      test : "WORKS"
    // token: [token, setToken],
    // productsAPI: ProductsAPI(),
    // userAPI: UserAPI(token),
    // categoriesAPI: CategoriesAPI(),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
