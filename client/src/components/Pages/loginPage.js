/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import UserAPI from "../APIs/userAPI";
import { withCookies ,Cookies } from "react-cookie";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await UserAPI.loginUser(user);

      localStorage.setItem("firstLogin", true);
      const cookies = new Cookies()
      cookies.set("token", res.data.token, {
        path: "/",
        expires: moment.unix(res.data.expiresAt).toDate(),
      });
      alert(res.data.msg)
      // window.location.href = "/";
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={loginSubmit}>
        <h2>Login</h2>
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

        <div className="row">
          <button type="submit">Login</button>
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default withRouter(withCookies(Login));
