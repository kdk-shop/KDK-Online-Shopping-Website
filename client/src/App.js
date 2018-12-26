import React, { Component } from 'react';
import { BrowserRouter as Router , Route} from 'react-router-dom'

import Navbar from '../src/components/layout/Navbar';
import Footer from '../src/components/layout/Footer';
import Landing from '../src/components/layout/Landing';
import Register from '../src/components/user/register';
import Login from '../src/components/user/login';
import Profile from '../src/components/user/profile';
import ChangePassword from '../src/components/user/changePassword';
import RecoverPassword from '../src/components/user/recoverPassword';
import Products from '../src/components/products/products';
import Product from '../src/components/products/product';
import AdminLogin from '../src/components/admin/login';
import Panel from '../src/components/admin/panel';
import Storages from '../src/components/admin/storages';
import AdminChangePAssword from '../src/components/admin/changePassword';
import Storage from '../src/components/admin/storage';
import AddStorage from '../src/components/admin/addStorage';
import EditStorage from '../src/components/admin/editStorage';
import ProductInformation from '../src/components/admin/productInformation';
import ProductList from '../src/components/admin/productList';
import AddProduct from '../src/components/admin/addProduct';
import Cart from '../src/components/cart/cart';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
        <Navbar/>
        <Route exact path="/" component={Landing} />
        <div className="container">
          <Route path="/register" component={Register}/>
          <Route path="/login" component={Login}/>
          <Route path="/profile" component={Profile}/>
          <Route path="/change-password" component={ChangePassword}/>
          <Route path="/recover-password" component={RecoverPassword}/>
          <Route path="/products" component={Products}/>
          <Route path="/product" component={Product}/>
          <Route path="/admin/login" component={AdminLogin}/>
          <Route exact path="/admin/panel" component={Panel}/>
          <Route exact path="/admin/panel/storages" component={Storages}/>
          <Route path="/admin/panel/change-password" component={AdminChangePAssword}/>
          <Route path="/admin/panel/storage" component={Storage}/>
          <Route path="/admin/panel/storages/add-storage" component={AddStorage}/>
          <Route path="/admin/panel/storages/edit" component={EditStorage}/>
          <Route path='/admin/panel/inventory/add-product' component={ProductInformation} />
          <Route path='/admin/panel/inventory/edit-product' component={ProductInformation} />
          <Route path='/admin/panel/inventory/product-list' component={ProductList} />
          <Route path='/admin/panel/inventory/add' component={AddProduct}/>
          <Route path='/cart' component={Cart} />
          
        </div>
        <Footer/>
        </div>
      </Router>
    );
  }
}

export default App;
