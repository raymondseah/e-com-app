/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { withRouter, Link, useParams } from "react-router-dom";
import userAPI from "./../APIs/userAPI";
import { withCookies } from "react-cookie";
import axios from "axios";
import qs from "qs";

function BtnRender({ product, deleteProduct }) {
  const [isAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const params = useParams();

  const readCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const addCart = async (product) => {
    const token = readCookie("token");
    console.log(token);

    const check = cart.every((item) => {
      return item._id !== product._id;
    });
    try {
      if (check) {
        setCart([...cart, { ...product, quantity: 1 }]);
        await axios.patch(
          "http://localhost:5000/api/v1/users/addchart",
          qs.stringify({ cart: [...cart, { ...product, quantity: 1 }] }),
          {
            headers: { auth_token: token },
          }
        );
      } else {
        alert("This product has been added to cart.");
      }
    } catch (err) {
      alert(err.response.data.msg);
      console.log(err.response.data.msg)
    }
  };

  return (
    <div className="row_btn">
      {isAdmin ? (
        <>
          <Link
            id="btn_buy"
            to="#!"
            onClick={() => deleteProduct(product._id, product.images.public_id)}
          >
            Delete
          </Link>
          <Link id="btn_view" to={`/products_edit/${product._id}`}>
            Edit
          </Link>
        </>
      ) : (
        <>
          <Link id="btn_buy" to="#!" onClick={() => addCart(product)}>
            Buy
          </Link>
          <Link id="btn_view" to={`/detail/${product._id}`}>
            View
          </Link>
        </>
      )}
    </div>
  );
}

export default withRouter(withCookies(BtnRender));
