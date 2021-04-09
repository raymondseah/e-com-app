/* eslint-disable no-unused-vars */
import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import createProduct from './components/Pages/createProduct'
import createCategory from './components/Pages/createCategory'


function App() {
  return (
    <div className="App">
 <Router>

        <Switch>
          <Route path="/category/create" component={createCategory}></Route>
          <Route path="/product/create" component={createProduct}></Route>
        </Switch>
 
      </Router>

    </div>
  );
}

export default App;
