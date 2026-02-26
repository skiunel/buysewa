import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import ParticleBackground from "./components/ParticleBackground";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import BuyerDashboard from "./pages/BuyerDashboard";
import ReviewSubmit from "./pages/ReviewSubmit";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <span className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Router>
      {/* Global elements on every page */}
      <ParticleBackground />
      <CustomCursor />
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* Buyer routes */}
        <Route path="/cart" element={<ProtectedRoute roles={["buyer"]}><Cart /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute roles={["buyer"]}><BuyerDashboard /></ProtectedRoute>} />
        <Route path="/review/:productId" element={<ProtectedRoute roles={["buyer"]}><ReviewSubmit /></ProtectedRoute>} />

        {/* Seller routes */}
        <Route path="/seller" element={<ProtectedRoute roles={["seller"]}><SellerDashboard /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <CartProvider>
      <AppContent />
    </CartProvider>
  </AuthProvider>
);

export default App;
