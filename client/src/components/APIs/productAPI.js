/* eslint-disable no-unused-vars */
import axios from "axios";
import qs from "qs";

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
};

export default ProductsAPI;
