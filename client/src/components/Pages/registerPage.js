/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */

import React, { useState } from "react";

import axios from "axios";
import UserAPI from "../APIs/userAPI";
import { withCookies } from "react-cookie";
import { withRouter, Link } from "react-router-dom";
import "./registerPage.css";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    console.log({ name, value } )
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await UserAPI.registerUser(user);

      localStorage.setItem("firstLogin", true);
      alert(res.data.msg);

      // window.location.href = "/";
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div id="login-page" className="container">
      <div id="register-form-container">
        {" "}
        <form onSubmit={registerSubmit}>
          <h2>Register</h2>
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            value={user.name}
            onChange={onChangeInput}
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            value={user.email}
            onChange={onChangeInput}
          />

          <input
            type="password"
            name="password"
            required
            autoComplete="on"
            placeholder="Password"
            value={user.password}
            onChange={onChangeInput}
          />

          <div className="">
            <button class="btn btn-primary" type="submit">Register</button>
            <Link class="btn btn-success" to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withRouter(withCookies(Register));
