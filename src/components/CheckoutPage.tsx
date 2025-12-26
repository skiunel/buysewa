import { useState } from "react";
import { ArrowLeft, Shield, CreditCard, Truck, CheckCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./common/ImageWithFallback";
import { useCart } from "../contexts/CartContext";
import { PaymentGateway } from "./PaymentGateway";
import { useAuth } from "../contexts/AuthContext";
import { useOrder } from "../contexts/OrderContext";
import { toast } from "sonner";

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, getTotalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = getTotalPrice();
  const delivery = subtotal > 0 ? (subtotal >= 10000 ? 0 : 199) : 0;
  const total = subtotal + delivery;

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`;
  };

  const handlePlaceOrder = async () => {
    try {
      // Check authentication - try multiple possible keys
      const userId = localStorage.getItem('userId') || 
                     localStorage.getItem('user_id') || 
                     localStorage.getItem('id');
      
      if (!userId) {
        console.error('No userId found in localStorage. Available keys:', Object.keys(localStorage));
        toast.error('Please login to place an order');
        onNavigate('login');
        return;
      }
      
      console.log('User ID found:', userId);

      // Get shipping info from form
      const shippingAddress = {
        firstName: (document.getElementById('firstName') as HTMLInputElement)?.value || '',
        lastName: (document.getElementById('lastName') as HTMLInputElement)?.value || '',
        email: (document.getElementById('email') as HTMLInputElement)?.value || '',
        phone: (document.getElementById('phone') as HTMLInputElement)?.value || '',
        city: (document.getElementById('city') as HTMLInputElement)?.value || '',
        address: (document.getElementById('address') as HTMLInputElement)?.value || ''
      };

      // Validate shipping address
      if (!shippingAddress.firstName || !shippingAddress.email || !shippingAddress.address) {
        toast.error('Please fill in all required shipping information');
        return;
      }

      // Create order first
      const { orderAPI } = await import('../services/api');
      const orderData = {
        userId,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingAddress,
        paymentMethod: paymentMethod,
        subtotal,
        delivery,
        total
      };

      const response = await orderAPI.create(orderData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create order');
      }

      const orderId = response.data?._id || response.data?.id || response.data?.orderNumber;
      
      // Handle eSewa payment
      if (paymentMethod === 'esewa') {
        try {
          toast.info('Redirecting to eSewa payment...');
          
          // Initiate eSewa payment
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
          const paymentResponse = await fetch(`${API_BASE_URL}/esewa/initiate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: total,
              orderId: orderId || `ORDER-${Date.now()}`,
              productName: 'BUYSEWA Order',
              customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
              customerEmail: shippingAddress.email,
              customerPhone: shippingAddress.phone
            })
          });

          const paymentData = await paymentResponse.json();
          
          if (paymentData.success && paymentData.data && paymentData.data.formData) {
            // Create and submit form to eSewa
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = paymentData.data.formUrl || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
            form.style.display = 'none';
            
            // Add all form fields from formData
            const formDataFields = paymentData.data.formData;
            Object.keys(formDataFields).forEach(key => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = formDataFields[key];
              form.appendChild(input);
            });
            
            document.body.appendChild(form);
            form.submit();
            
            // Don't clear cart yet - wait for payment confirmation
            return;
          } else {
            throw new Error(paymentData.message || 'Failed to initiate eSewa payment');
          }
        } catch (error: any) {
          console.error('eSewa payment error:', error);
          toast.error(error.message || 'Failed to initiate eSewa payment');
          return;
        }
      } else {
        // For other payment methods (COD, Card, etc.)
        clearCart();
        setOrderPlaced(true);
        setCurrentStep(4);
        toast.success('Order placed successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
      console.error('Order error:', error);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 p-8 text-center">
          <div className="w-16 h-16 bg-[#00CC99] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. You'll receive a confirmation email shortly.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Order Number</p>
            <p className="font-mono font-bold">#BUYSEWA-2024-001234</p>
          </div>
          <div className="space-y-3">
            <Button 
              className="w-full bg-[#003366] hover:bg-[#002244] text-white"
              onClick={() => onNavigate("home")}
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onNavigate("dashboard")}
            >
              Track Order
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate("home")}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-[#00CC99]" />
            <span className="text-sm text-[#00CC99] font-medium">Secure Checkout</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: "Cart", icon: "📝" },
              { step: 2, label: "Shipping", icon: "🚚" },
              { step: 3, label: "Payment", icon: "💳" },
              { step: 4, label: "Confirmation", icon: "✅" }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= item.step
                      ? "bg-[#003366] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <span className="text-sm">{item.step}</span>
                </div>
                <span className="ml-2 text-sm font-medium">{item.label}</span>
                {index < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > item.step ? "bg-[#003366]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            {currentStep === 1 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Your Cart</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">NPR {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button
                    className="w-full bg-[#003366] hover:bg-[#002244] text-white"
                    onClick={() => setCurrentStep(2)}
                    disabled={items.length === 0}
                  >
                    Continue to Shipping
                  </Button>
                </div>
              </Card>
            )}

            {/* Shipping Information */}
            {currentStep === 2 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter last name" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Enter city" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Enter full address" />
                  </div>
                </div>
                <div className="mt-6 flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Back to Cart
                  </Button>
                  <Button
                    className="flex-1 bg-[#003366] hover:bg-[#002244] text-white"
                    onClick={() => setCurrentStep(3)}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </Card>
            )}

            {/* Payment Information */}
            {currentStep === 3 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                      <CreditCard className="h-5 w-5" />
                      <span>Credit/Debit Card</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="esewa" id="esewa" />
                    <Label htmlFor="esewa" className="cursor-pointer">eSewa</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="khalti" id="khalti" />
                    <Label htmlFor="khalti" className="cursor-pointer">Khalti</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="cursor-pointer">Cash on Delivery</Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1"
                  >
                    Back to Shipping
                  </Button>
                  <Button
                    className="flex-1 bg-[#FF6600] hover:bg-[#e55a00] text-white"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>NPR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>NPR {delivery}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>NPR {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>Free delivery on orders over NPR 5,000</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-[#00CC99]" />
                  <span>Secure payment with blockchain verification</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#00CC99] bg-opacity-10 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-5 w-5 text-[#00CC99]" />
                  <span className="font-medium text-[#00CC99]">Review Guarantee</span>
                </div>
                <p className="text-sm text-gray-700">
                  After delivery, you'll receive a unique Standard Delivery Code (SDC) to submit verified reviews.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}