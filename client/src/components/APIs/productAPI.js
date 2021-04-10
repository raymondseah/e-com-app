/* eslint-disable no-unused-vars */
import axios from "axios";
import qs from "qs";

import { useState, useEffect } from "react";

const baseUrl = "http://localhost:5000/api/v1";
const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
});
const ProductsAPI = {
  createProduct: (product, images) => {
    return axiosInstance.post(
      "/products/create",
      qs.stringify({
        product: product,
        images: images,
      })
    );
  },
  deleteProductById: (id) => {
    return axiosInstance.delete(`products/delete/${id}`);
  },
};

export default ProductsAPI;
