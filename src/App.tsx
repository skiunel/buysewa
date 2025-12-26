import { useState } from "react";
import { Header } from "./components/Header";
import { Homepage } from "./components/Homepage";
import { ProductPage } from "./components/ProductPage";
import { ProductListing } from "./components/ProductListing";
import { CheckoutPage } from "./components/CheckoutPage";
import { ReviewSubmission } from "./components/ReviewSubmission";
import { SellerDashboard } from "./components/SellerDashboard";
import { BuyerDashboard } from "./components/BuyerDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { LoginPage } from "./components/LoginPage";
import { Footer } from "./components/Footer";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { OrderProvider } from "./contexts/OrderContext";
import { Toaster } from "./components/ui/sonner";
import { CustomerSupport } from "./components/CustomerSupport";

type User = {
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  name: string;
} | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User>(null);

  const handleNavigate = (page: string, productId?: number | string, category?: string) => {
    setCurrentPage(page);
    if (productId !== undefined) {
      setSelectedProductId(productId);
    }
    if (category !== undefined) {
      setSelectedCategory(category);
    } else if (page !== 'products') {
      setSelectedCategory(undefined);
    }
  };

  const handleLogin = (userData: { email: string; role: 'buyer' | 'seller' | 'admin'; name: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("home");
    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Homepage onNavigate={handleNavigate} user={user} />;
      case "products":
        return <ProductListing onNavigate={handleNavigate} selectedCategory={selectedCategory} />;
      case "product":
        return <ProductPage onNavigate={handleNavigate} productId={selectedProductId} />;
      case "checkout":
        // Protect checkout - only logged in buyers can access
        if (!user || user.role !== 'buyer') {
          setCurrentPage("login");
          return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
        }
        return <CheckoutPage onNavigate={handleNavigate} />;
      case "review":
        // Protect review submission - only logged in buyers can access
        if (!user || user.role !== 'buyer') {
          setCurrentPage("login");
          return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
        }
        return <ReviewSubmission onNavigate={handleNavigate} />;
      case "dashboard":
        // Protect dashboard - only logged in users can access
        if (!user) {
          setCurrentPage("login");
          return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
        }
        // Route to appropriate dashboard based on user role
        if (user.role === 'seller') {
          return <SellerDashboard onNavigate={handleNavigate} />;
        } else if (user.role === 'admin') {
          return <AdminDashboard onNavigate={handleNavigate} />;
        } else {
          return <BuyerDashboard onNavigate={handleNavigate} />;
        }
      case "login":
        return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
      default:
        return <Homepage onNavigate={handleNavigate} />;
    }
  };

  return (
    <CartProvider>
      <AuthProvider>
        <OrderProvider>
          <div className="min-h-screen flex flex-col">
            <Header 
              currentPage={currentPage} 
              onNavigate={handleNavigate} 
              user={user}
              onLogout={handleLogout}
            />
            <main className="flex-1">
              {renderPage()}
            </main>
            {currentPage !== "login" && <Footer />}
            <Toaster />
            {/* AI Chatbot - Available on all pages */}
            <CustomerSupport />
          </div>
        </OrderProvider>
      </AuthProvider>
    </CartProvider>
  );
}