/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Loading from "../Others/loading";
import categoryAPI from "./../APIs/catergoryAPI";
import productAPI from "./../APIs/productAPI";
import BtnRender from "./Btnrender";
import { Link } from "react-router-dom";
import qs from "qs";

function Products() {
  const [products, setProducts] = useState([]);
  const [callback, setCallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(0);

  const [isAdmin] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/v1/products?limit=${
          page * 9
        }&${category}&${sort}&title[regex]=${search}`
      );
      setResult(res.data.result);
      setProducts(res.data.products);
    };
    getProducts();

    const getCategories = async () => {
      const res = await categoryAPI.getAllCategory();
      setCategories(res.data);
    };
    getCategories();
  }, [callback, category, sort, search, page]);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      const destroyImg = axios.post(
        "http://localhost:5000/api/v1/images/delete",
        qs.stringify({ public_id })
      );
      const deleteProduct = productAPI.deleteProductById(id);

      await destroyImg;
      await deleteProduct;
      setCallback(!callback);
      setLoading(false);
      console.log(destroyImg.data.msg);
      console.log(deleteProduct.data.msg);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const deleteAll = () => {
    products.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.images.public_id);
    });
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setSearch("");
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  return (
    <div className="">
      <div className="row">
        <span>Filters: </span>
        <select name="category" value={category} onChange={handleCategory}>
          <option value="">All Products</option>
          {categories.map((category) => (
            <option value={"category=" + category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        value={search}
        placeholder="Enter your search!"
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      <div className="row sort">
        <span>Sort By: </span>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Newest</option>
          <option value="sort=oldest">Oldest</option>
          <option value="sort=-sold">Best sales</option>
          <option value="sort=-price">Price: Hight-Low</option>
          <option value="sort=price">Price: Low-Hight</option>
        </select>
      </div>
      <h1>test</h1>
      {isAdmin && (
        <div className="delete-all">
          <span>Select all</span>
          <input type="checkbox" checked={isCheck} onChange={checkAll} />
          <button onClick={deleteAll}>Delete ALL</button>
        </div>
      )}

      <div className="products">
        {products.map((product) => {
          return (
            <div className="product_card">
              {isAdmin && (
                <input
                  type="checkbox"
                  checked={product.checked}
                  onChange={() => handleCheck(product._id)}
                />
              )}
              <img src={product.images.url} alt="" />

              <div className="product_box">
                <h2 title={product.title}>{product.title}</h2>
                <span>${product.price}</span>
                <p>{product.description}</p>
              </div>

              <BtnRender product={product} deleteProduct={deleteProduct} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;
