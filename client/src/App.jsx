import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/index.jsx';
import Products from './pages/Products/index.jsx';
import ProductDetail from './pages/ProductDetail/index.jsx';
import Signin from './pages/Auth/Signin/index.jsx';
import Signup from './pages/Auth/Signup/index.jsx';
import Basket from './pages/Basket/index.jsx';
import { ProductedProfile, ProductedAdmin } from './pages/ProductedRoute/index.jsx';
import Orders from './pages/Admin/Orders.jsx';
import AdminProducts from './pages/Admin/AdminProducts.jsx';
import AdminProductDetail from './pages/Admin/AdminProductDetail.jsx';
import BlockchainReviews from './pages/Admin/BlockchainReviews.jsx';
import ReviewManagement from './pages/Admin/ReviewManagement.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Products />} />
        <Route path="/product/:product_id" element={<ProductDetail />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/basket" element={<Basket />} />

        {/* Protected User Routes */}
        <Route path="/profile" element={<ProductedProfile />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProductedAdmin />} />
        <Route
          path="/admin/orders"
          element={
            <ProductedAdmin>
              <Orders />
            </ProductedAdmin>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProductedAdmin>
              <AdminProducts />
            </ProductedAdmin>
          }
        />
        <Route
          path="/admin/products/:product_id"
          element={
            <ProductedAdmin>
              <AdminProductDetail />
            </ProductedAdmin>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProductedAdmin>
              <ReviewManagement />
            </ProductedAdmin>
          }
        />
        <Route
          path="/admin/blockchain"
          element={
            <ProductedAdmin>
              <BlockchainReviews />
            </ProductedAdmin>
          }
        />
      </Routes>
    </>
  );
}

export default App;
