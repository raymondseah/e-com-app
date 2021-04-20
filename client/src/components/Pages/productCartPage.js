/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import PaypalButton from "./paypal";
import qs from "qs";
import "./productCartPage.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isAdmin, setIsAdmin] = useState();
  // const [cartLength, setCartLength] = useState(0);

  useEffect(() => {
    if (cart !== null) {
      getTotal();
    }
    getUserCart();
  }, [cart]);

  const getTotal = () => {
    const total = cart.reduce((prev, item) => {
      return prev + item.price * item.quantity;
    }, 0);
    setTotal(total);
  };

  const getUserCart = () => {
    const token = readCookie("token");
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get(
            "http://localhost:5000/api/v1/users/infor",
            {
              headers: { auth_token: token },
            }
          );
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
          setCart(res.data.cart);
        } catch (err) {
          alert(err);
        }
      };
      getUser();
    }
  };

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

  const addToCart = async (cart) => {
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

  const increment = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity++;
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };

  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity -= 1;
        if (item.quantity < 1) {
          item.quantity = 1;
        }
        return;
        // item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };

  const removeProduct = (id) => {
    if (window.confirm("Do you want to delete this product?")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });

      setCart([...cart]);
      addToCart(cart);
    }
  };

  const tranSuccess = async (payment) => {
    const { paymentID, address } = payment;

    await axios.post(
      "/api/payment",
      { cart, paymentID, address },
      {
        headers: { Authorization: token },
      }
    );

    setCart([]);
    addToCart([]);
    alert("You have successfully placed an order.");
  };

  if (cart === null)
    return (
      <div id="cart_page">
        <h2
          id="product_cart_container"
          style={{ textAlign: "center", fontSize: "5rem" }}
        >
          Cart Empty
        </h2>
      </div>
    );
  return (
    <div id="cart" className="container">
      <div id="product_cart_container">
        {" "}
        {cart.map((product) => (
          <div className="detail_cart_section container">
            <div className="detail cart" key={product._id}>
              <img src={product.images.url} alt="" />
              <div className="box-detail">
                <h2>{product.title}</h2>
                <h3>$ {product.price * product.quantity}</h3>
                <p>{product.description}</p>
                <p>{product.content}</p>
                <div className="amount">
                  <button onClick={() => decrement(product._id)}> - </button>
                  <span>{product.quantity}</span>
                  <button onClick={() => increment(product._id)}> + </button>
                </div>
                <div
                  className="delete"
                  onClick={() => removeProduct(product._id)}
                >
                  X
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="total">
          <h3>Total: $ {total}</h3>
          <PaypalButton total={total} tranSuccess={tranSuccess} />
        </div>
      </div>
    </div>
  );
}

export default Cart;
