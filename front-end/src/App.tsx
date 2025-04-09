import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Home from "./pages/Home";
import ProfileInfo from "./pages/ProfileInfo";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddProducts from "./pages/AddProducts";
import MyOrders from "./pages/MyOrders";
import EditProduct from "./pages/EditProduct";
import "./styles/App.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="app-container">
        <div className="content-wrapper">
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<PrivateRoute />}>
                <Route index element={<Home />} />
              </Route>
              <Route path="/profile" element={<PrivateRoute />}>
                <Route index element={<ProfileInfo />} />
              </Route>
              <Route path="/add-products" element={<PrivateRoute />}>
                <Route index element={<AddProducts />} />
              </Route>
              <Route path="/my-orders" element={<PrivateRoute />}>
                <Route index element={<MyOrders />} />
              </Route>
              <Route path="/edit-product" element={<PrivateRoute />}>
                <Route index element={<EditProduct />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />          
            </Routes>
          </Router>
        </div>
      </div>
    </AuthProvider>   
  );
};

export default App;
