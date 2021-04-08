import axios from "axios";
import qs from "qs";

const baseUrl = "http://localhost:5000/api/v1";
const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
});

const CategoriesAPI = {
  getAllCategory: () => {
    return axiosInstance.get("/category");
  },
  deleteCategoryById: (id) => {
    return axiosInstance.delete(`/category/${id}`);
  },
  createCategory: (name) => {
    return axiosInstance.post(
      "/category",
      qs.stringify({
        name: name,
      })
    );
  },
  editCategory: (id, name) => {
    return axiosInstance.put(
      `/category/${id}`,
      qs.stringify({
        name: name,
      })
    );
  },
};

export default CategoriesAPI;
