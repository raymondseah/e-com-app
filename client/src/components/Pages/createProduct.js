/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../Others/loading";
import { useHistory, useParams } from "react-router-dom";
import categoryAPI from "./../APIs/catergoryAPI";
import productAPI from "./../APIs/productAPI";
import qs from "qs";

const initialState = {
  product_id: "",
  title: "",
  price: 0,
  description: "add description",
  content: "more details",
  category: "",
  _id: "",
};

function CreateProduct() {
  const [product, setProduct] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagesId, setImagesId] = useState("");

  const history = useHistory();
  const param = useParams();

  const [products] = useState([]);
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    if (param.id) {
      setOnEdit(true);
      products.forEach((product) => {
        if (product._id === param.id) {
          setProduct(product);
          setImages(product.images);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages(false);
    }
    const getCategories = async () => {
      const res = await categoryAPI.getAllCategory();
      setCategories(res.data);
    };
    getCategories();
  }, [param.id, products]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    try {
      if (!file) return alert("File not exist.");

      if (file.size > 1024 * 1024)
        // 1mb
        return alert("Size too large!");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        // 1mb
        return alert("File format is incorrect.");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/v1/images/upload",
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );
      setLoading(false);
      setImages(res.data);
    } catch (err) {
      alert(err.response.data.msg);
      console.log(err)
    }
  };

  const handleDestroy = async () => {
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/v1/images/delete",
        qs.stringify({
          public_id: images.public_id,
        })
      );
      setLoading(false);
      setImages(false);
      clearInput();
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const clearInput = () => {
    document.getElementById('file_up').value = '';
  }

  const handleChangeInput = (e) => {
    //set name to the input value
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // if(!isAdmin) return alert("You're not an admin")
      if (!images) return alert("No Image Upload");

      if (onEdit) {
        await axios.put(
          `/api/products/${product._id}`,
          { ...product, images }
        );
      } else {
          
          await productAPI.createProduct(product, images)
        // await axios.post(
        //   "/api/products",
        //   { ...product, images }
        // );
      }
      setCallback(!callback);
      
    //   history.push("/");
    } catch (err) {
      console.log(err);
      alert(err.response.data.msg);
    }
  };

  const styleUpload = {
    display: images ? "block" : "none",
  };
  return (
    <div className="create_product">
      <div className="upload">
        <input type="file" name="file" id="file_up" onChange={handleUpload} />
        {loading ? (
          <div id="file_img">
            <Loading />
          </div>
        ) : (
          <div id="file_img" style={styleUpload}>
            <img src={images ? images.url : ""} alt="" />
            <span onClick={handleDestroy}>X</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="product_id">Product ID</label>
          <input
            type="text"
            name="product_id"
            id="product_id"
            required
            value={product.product_id}
            onChange={handleChangeInput}
            disabled={onEdit}
          />
        </div>

        <div className="row">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={product.title}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            value={product.price}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            required
            value={product.description}
            rows="5"
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="content">Content</label>
          <textarea
            type="text"
            name="content"
            id="content"
            required
            value={product.content}
            rows="7"
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="categories">Categories: </label>
          <select
            name="category"
            value={product.category}
            onChange={handleChangeInput}
          >
            <option value="">Please select a category</option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">{onEdit ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}

export default CreateProduct;
