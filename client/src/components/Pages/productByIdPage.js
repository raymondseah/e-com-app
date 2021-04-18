/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import productAPI from "./../APIs/productAPI";
import './productByIdPage.css'

function ProductByIdPage() {
  const params = useParams();
  //   const [products, setProducts] = useState();
  //   const addCart = useState();
  const [detailProduct, setDetailProduct] = useState([]);

  useEffect(() => {
    const getProductsByID = async (id) => {
      const res = await productAPI.getProductsById(params.id);
      console.log(res);
      setDetailProduct(res.data);
    };
    getProductsByID();
  }, [params.id]);

  const addCart = async (cart) => {
    const token = readCookie("token");
    console.log(token);

    await axios.patch(
      "http://localhost:5000/api/v1/users/addchart",

      qs.stringify({ cart }),
      {
        headers: { auth_token: token },
      }
    );
  };

  if (detailProduct.length === 0) return null;

  return (
    <>
      <div id="detailed_product_page" className="">
        <div id="detailed_container">
          {" "}
          <img src={detailProduct.images.url} alt="" />
          <div className="box-detail">
            <div className="row">
              <h2>{detailProduct.title}</h2>
              <h6>#id: {detailProduct.product_id}</h6>
            </div>
            <span>$ {detailProduct.price}</span>
            <p>{detailProduct.description}</p>
            <p>{detailProduct.content}</p>
            <p>Sold: {detailProduct.sold}</p>
            <Link
              to="/cart"
              className="cart"
              onClick={() => addCart(detailProduct)}
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductByIdPage;
