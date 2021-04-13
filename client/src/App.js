/* eslint-disable no-unused-vars */
import logo from "./logo.svg";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import createProduct from "./components/Pages/createProduct";
import createCategory from "./components/Pages/createCategory";
import registerPage from "./components/Pages/registerPage";
import loginPage from "./components/Pages/loginPage";
import productDetailById from "./components/Pages/productByIdPage"
import allProducts from "./components/Pages/allProductPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/category/create" component={createCategory}></Route>

          <Route path="/products/create" component={createProduct}></Route>
          <Route path="/products_edit/:id" component={createProduct}></Route>
          <Route path="/detail/:id" component={productDetailById}></Route>

          <Route path="/register" component={registerPage}></Route>
          <Route path="/login" component={loginPage}></Route>

          <Route path="/products" component={allProducts}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
