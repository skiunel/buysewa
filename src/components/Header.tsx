import { Search, ShoppingCart, User, Shield, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";
import { ImageWithFallback } from "./common/ImageWithFallback";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user?: {
    email: string;
    role: 'buyer' | 'seller' | 'admin';
    name: string;
  } | null;
  onLogout?: () => void;
}

export function Header({ currentPage, onNavigate, user, onLogout }: HeaderProps) {
  const { items, getTotalItems, removeFromCart, getTotalPrice } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`;
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center space-x-2"
            >
              <Shield className="h-8 w-8 text-[#003366]" />
              <div>
                <span className="text-2xl font-bold text-[#003366]">BUYSEWA</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-[#00CC99]">✓ Blockchain Verified</span>
                </div>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for products..."
                className="pl-10 pr-4 w-full"
                onClick={() => onNavigate("products")}
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => onNavigate("home")}
              className={`text-sm font-medium ${
                currentPage === "home" ? "text-[#003366]" : "text-gray-600 hover:text-[#003366]"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("products")}
              className={`text-sm font-medium ${
                currentPage === "products" || currentPage === "product" ? "text-[#003366]" : "text-gray-600 hover:text-[#003366]"
              }`}
            >
              Products
            </button>
            {user && (
              <button
                onClick={() => onNavigate("dashboard")}
                className={`text-sm font-medium ${
                  currentPage === "dashboard" ? "text-[#003366]" : "text-gray-600 hover:text-[#003366]"
                }`}
              >
                {user.role === 'seller' ? 'Dashboard' : 
                 user.role === 'admin' ? 'Admin' : 'Account'}
              </button>
            )}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#FF6600]">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Shopping Cart ({getTotalItems()} items)</SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Your cart is empty</p>
                      <Button
                        onClick={() => {
                          setCartOpen(false);
                          onNavigate("products");
                        }}
                        className="bg-[#003366] hover:bg-[#002244]"
                      >
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {items.map(item => (
                          <div key={item.id} className="flex gap-4 border-b pb-4">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium line-clamp-1">{item.name}</h4>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              <p className="font-semibold text-[#003366]">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4 mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Subtotal:</span>
                          <span className="font-semibold">{formatPrice(getTotalPrice())}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-4">
                          <span>Delivery:</span>
                          <span className="text-[#00CC99]">FREE</span>
                        </div>
                        <div className="flex justify-between text-lg">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-[#003366]">{formatPrice(getTotalPrice())}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-[#FF6600] hover:bg-[#e55a00]"
                          onClick={() => {
                            setCartOpen(false);
                            onNavigate("checkout");
                          }}
                        >
                          Proceed to Checkout
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setCartOpen(false);
                            onNavigate("products");
                          }}
                        >
                          Continue Shopping
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
                  <User className="h-5 w-5" />
                </Button>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                  <span className="text-sm font-medium line-clamp-1">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="hidden lg:flex"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onNavigate("login")}
                className="bg-[#003366] hover:bg-[#002244] text-white"
              >
                Login
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="lg:hidden border-t px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for products..."
            className="pl-10 pr-4 w-full"
            onClick={() => onNavigate("products")}
          />
        </div>
      </div>
    </header>
  );
}