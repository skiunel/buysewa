import { useState } from "react";
import { CreditCard, Smartphone, Building2, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { paymentAPI } from "../services/api";
import { ImageWithFallback } from "./common/ImageWithFallback";

interface PaymentGatewayProps {
  amount: number;
  orderId: string;
  onSuccess: (paymentData: any) => void;
  onCancel: () => void;
}

type PaymentMethod = 'esewa' | 'khalti' | 'card' | 'cod';

export function PaymentGateway({ amount, orderId, onSuccess, onCancel }: PaymentGatewayProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('esewa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [showESewaDialog, setShowESewaDialog] = useState(false);
  const [showKhaltiDialog, setShowKhaltiDialog] = useState(false);

  // Card payment fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      if (paymentMethod === 'esewa') {
        try {
          // Use real eSewa API with HMAC signatures
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
          const response = await fetch(`${API_BASE_URL}/esewa/initiate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount,
              orderId,
              productName: 'BUYSEWA Order',
              customerName: localStorage.getItem('userName') || 'Customer',
              customerEmail: localStorage.getItem('userEmail') || '',
              customerPhone: ''
            })
          });

          const data = await response.json();
          
          if (data.success && data.data && data.data.formData) {
            // Create and submit form to eSewa
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = data.data.formUrl || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
            form.style.display = 'none';
            
            // Add all form fields from formData
            const formData = data.data.formData;
            Object.keys(formData).forEach(key => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = formData[key];
              form.appendChild(input);
            });
            
            document.body.appendChild(form);
            form.submit();
          } else {
            console.error('eSewa response error:', data);
            throw new Error(data.message || 'Failed to initiate payment');
          }
        } catch (error: any) {
          console.error('eSewa payment error:', error);
          setPaymentStatus('failed');
          setIsProcessing(false);
          alert(error.message || 'Failed to initiate eSewa payment');
        }
      } else if (paymentMethod === 'khalti') {
        setShowKhaltiDialog(true);
        // Simulate Khalti payment
        setTimeout(async () => {
          const response = await paymentAPI.khalti.initiate(amount, orderId);
          setPaymentStatus('success');
          setTimeout(() => {
            setShowKhaltiDialog(false);
            onSuccess({
              method: 'Khalti',
              transactionId: `KHALTI-${Date.now()}`,
              amount
            });
          }, 2000);
        }, 3000);
      } else if (paymentMethod === 'card') {
        // Simulate card payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPaymentStatus('success');
        setTimeout(() => {
          onSuccess({
            method: 'Credit/Debit Card',
            transactionId: `CARD-${Date.now()}`,
            amount
          });
        }, 1000);
      } else if (paymentMethod === 'cod') {
        // Cash on delivery
        setPaymentStatus('success');
        setTimeout(() => {
          onSuccess({
            method: 'Cash on Delivery',
            transactionId: `COD-${Date.now()}`,
            amount
          });
        }, 1000);
      }
    } catch (error) {
      setPaymentStatus('failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
            {/* eSewa */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="esewa" id="esewa" />
              <Label htmlFor="esewa" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">eSewa</p>
                      <p className="text-sm text-gray-600">Digital Wallet</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-green-600 text-green-600">Popular</Badge>
                </div>
              </Label>
            </div>

            {/* Khalti */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="khalti" id="khalti" />
              <Label htmlFor="khalti" className="flex-1 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Khalti</p>
                    <p className="text-sm text-gray-600">Digital Wallet</p>
                  </div>
                </div>
              </Label>
            </div>

            {/* Credit/Debit Card */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-gray-600">Visa, Mastercard, etc.</p>
                  </div>
                </div>
              </Label>
            </div>

            {/* Cash on Delivery */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when you receive</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {/* Card Details Form */}
          {paymentMethod === 'card' && (
            <div className="mt-6 space-y-4 p-4 border rounded-lg bg-gray-50">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="123"
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value)}
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Order Total</span>
            <span className="font-bold text-xl text-[#003366]">NPR {amount.toLocaleString()}</span>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#FF6600] hover:bg-[#e55a00] text-white"
              onClick={handlePayment}
              disabled={isProcessing || paymentStatus === 'success'}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : paymentStatus === 'success' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Payment Successful
                </>
              ) : (
                `Pay NPR ${amount.toLocaleString()}`
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* eSewa Payment Dialog */}
      <Dialog open={showESewaDialog} onOpenChange={setShowESewaDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>eSewa Payment</DialogTitle>
            <DialogDescription>Processing your payment through eSewa digital wallet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                {paymentStatus === 'processing' ? (
                  <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
                ) : paymentStatus === 'success' ? (
                  <CheckCircle className="h-12 w-12 text-green-600" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-600" />
                )}
              </div>
            </div>
            <div className="text-center">
              <p className="font-medium text-lg">
                {paymentStatus === 'processing' && 'Processing Payment...'}
                {paymentStatus === 'success' && 'Payment Successful!'}
                {paymentStatus === 'failed' && 'Payment Failed'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {paymentStatus === 'processing' && 'Please wait while we process your payment via eSewa'}
                {paymentStatus === 'success' && 'Your payment has been confirmed'}
                {paymentStatus === 'failed' && 'Please try again or use another payment method'}
              </p>
            </div>
            {paymentStatus === 'processing' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Payment Details</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">NPR {amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-medium">{orderId}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Khalti Payment Dialog */}
      <Dialog open={showKhaltiDialog} onOpenChange={setShowKhaltiDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Khalti Payment</DialogTitle>
            <DialogDescription>Processing your payment through Khalti digital wallet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                {paymentStatus === 'processing' ? (
                  <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
                ) : paymentStatus === 'success' ? (
                  <CheckCircle className="h-12 w-12 text-purple-600" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-600" />
                )}
              </div>
            </div>
            <div className="text-center">
              <p className="font-medium text-lg">
                {paymentStatus === 'processing' && 'Processing Payment...'}
                {paymentStatus === 'success' && 'Payment Successful!'}
                {paymentStatus === 'failed' && 'Payment Failed'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {paymentStatus === 'processing' && 'Please wait while we process your payment via Khalti'}
                {paymentStatus === 'success' && 'Your payment has been confirmed'}
                {paymentStatus === 'failed' && 'Please try again or use another payment method'}
              </p>
            </div>
            {paymentStatus === 'processing' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Payment Details</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">NPR {amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-medium">{orderId}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}