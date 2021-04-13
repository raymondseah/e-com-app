/* eslint-disable no-unused-vars */
import axios from "axios";
import qs from "qs";

import { useState, useEffect } from "react";

const baseUrl = "http://localhost:5000/api/v1";
const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
});
const UsersAPI = {
  registerUser: (user) => {
    return axiosInstance.post(
      "/users/register",
      qs.stringify({
        user: user,
      })
    );
  },
  loginUser: (user) => {
    return axiosInstance.post(
      "/users/login",
      qs.stringify({
        user: user,
      })
    );
  },
  addCart: (product) => {
    return axiosInstance.patch(
      "/addchart",
      qs.stringify({
        product: product,
      })
    );
  },
};

export default UsersAPI;
