import { useState } from 'react';
import { ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface QuickBuyEsewaProps {
  product: {
    id: number | string;
    name: string;
    price: number;
    image: string;
  };
  onSuccess?: () => void;
  className?: string;
}

export function QuickBuyEsewa({ product, onSuccess, className = '' }: QuickBuyEsewaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Kathmandu',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuickBuy = async () => {
    // Validate inputs
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate phone
    if (!/^\d{10}$/.test(shippingInfo.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      // Calculate total (price + 10% tax + delivery)
      const tax = Math.floor(product.price * 0.1);
      const delivery = product.price >= 10000 ? 0 : 199;
      const total = product.price + tax + delivery;

      // Call eSewa initiate endpoint
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/esewa/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: product.price,
          orderId: `QUICK-BUY-${product.id}-${Date.now()}`,
          productName: product.name,
          customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          customerEmail: shippingInfo.email,
          customerPhone: shippingInfo.phone,
          shippingAddress: shippingInfo,
          total: total
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const paymentData = await response.json();

      if (paymentData.success && paymentData.data?.formData) {
        // Store order info for verification
        sessionStorage.setItem('quickBuyOrderInfo', JSON.stringify({
          productId: product.id,
          productName: product.name,
          amount: product.price,
          customerEmail: shippingInfo.email,
          timestamp: Date.now()
        }));

        // Create and submit form to eSewa
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentData.data.formUrl || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
        form.style.display = 'none';

        const formDataFields = paymentData.data.formData;
        Object.keys(formDataFields).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = formDataFields[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        setIsOpen(false);
        form.submit();

        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error(paymentData.message || 'Failed to initiate payment');
      }
    } catch (error: any) {
      console.error('Quick buy error:', error);
      toast.error(error.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const tax = Math.floor(product.price * 0.1);
  const delivery = product.price >= 10000 ? 0 : 199;
  const total = product.price + tax + delivery;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 flex items-center justify-center gap-2 ${className}`}
      >
        <ShoppingCart className="h-5 w-5" />
        Buy Now with eSewa
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Quick Buy: {product.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="p-4 bg-gray-50">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product Price:</span>
                  <span className="font-medium">NPR {product.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-medium">NPR {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charge:</span>
                  <span className="font-medium">{delivery === 0 ? 'FREE' : `NPR ${delivery}`}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total Amount:</span>
                  <span className="font-bold text-lg text-green-600">NPR {total.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            {/* Shipping Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span>Please enter your complete shipping information</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={shippingInfo.firstName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={shippingInfo.lastName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+977 9800000000"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main Street"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <select
                  id="city"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Biratnagar">Biratnagar</option>
                  <option value="Janakpur">Janakpur</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleQuickBuy}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'Processing...' : `Pay NPR ${total.toLocaleString()}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
